// Cloudflare Worker: GeoJSON Push + R2 Proxy + Quota Management
// EXPO_PUSH_URL is now read from env (wrangler.toml [vars])

// 無料枠上限 (Cloudflare Workers: 10万req/日, R2 Class B: 1000万req/月)
const DAILY_REQUEST_LIMIT = 90000;   // 9万/日 (余裕を持たせる)
const MONTHLY_READ_LIMIT = 9000000;  // 900万/月

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Quota-Warning, X-Quota-Exceeded',
    'Access-Control-Expose-Headers': 'X-Quota-Warning, X-Quota-Exceeded, X-Quota-Usage, X-Quota-Daily',
  };
}

function verifyAuth(request, env) {
  if (!env.API_KEY) {
    console.error('API_KEY secret is not configured - run: wrangler secret put API_KEY');
    return false;
  }
  const auth = request.headers.get('Authorization');
  return auth === `Bearer ${env.API_KEY}`;
}

// 現在の月キーと日キーを取得
function monthKey() { const d = new Date(); return `quota:${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`; }
function dayKey()   { const d = new Date(); return `quota:daily:${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`; }

// カウンターインクリメント (KV)
// WARNING: This KV-based counter has a race condition (read-then-write without atomicity).
// Multiple concurrent requests can overwrite each other's increments.
// For production, migrate to D1 (atomic UPDATE) or Durable Objects (consistent state).
// As a best-effort mitigation, the count is stored in KV's metadata field alongside the value.
async function incrCounter(env, key, field) {
  // Best-effort: read with metadata to detect concurrent writes
  const raw = await env.DEVICE_TOKENS.get(key, 'json') || { reads: 0, writes: 0, bandwidthKB: 0 };
  raw[field] = (raw[field] || 0) + 1;
  await env.DEVICE_TOKENS.put(key, JSON.stringify(raw), {
    metadata: { lastUpdated: Date.now() },
  });
  return raw;
}

// データサイズから帯域を計算して加算
// WARNING: Same race condition as incrCounter. Best-effort only.
async function addBandwidth(env, key, bytes) {
  const raw = await env.DEVICE_TOKENS.get(key, 'json') || { reads: 0, writes: 0, bandwidthKB: 0 };
  raw.bandwidthKB = (raw.bandwidthKB || 0) + Math.ceil(bytes / 1024);
  await env.DEVICE_TOKENS.put(key, JSON.stringify(raw), {
    metadata: { lastUpdated: Date.now() },
  });
  return raw;
}

// クォータ制限チェック
async function checkQuota(env) {
  const mKey = monthKey();
  const dKey = dayKey();
  const monthly = await env.DEVICE_TOKENS.get(mKey, 'json') || { reads: 0, writes: 0, bandwidthKB: 0 };
  const daily = await env.DEVICE_TOKENS.get(dKey, 'json') || { reads: 0, writes: 0, bandwidthKB: 0 };

  const dailyTotal = daily.reads + daily.writes;
  const monthlyTotal = monthly.reads + monthly.writes;

  // 超過判定
  const dailyExceeded = dailyTotal >= DAILY_REQUEST_LIMIT;
  const monthlyExceeded = monthlyTotal >= MONTHLY_READ_LIMIT;

  return {
    blocked: dailyExceeded || monthlyExceeded,
    warning: dailyTotal >= DAILY_REQUEST_LIMIT * 0.85 || monthlyTotal >= MONTHLY_READ_LIMIT * 0.85,
    monthly: { reads: monthly.reads, writes: monthly.writes, bandwidthKB: monthly.bandwidthKB },
    daily: { reads: daily.reads, writes: daily.writes, bandwidthKB: daily.bandwidthKB },
    limits: { daily: DAILY_REQUEST_LIMIT, monthly: MONTHLY_READ_LIMIT },
  };
}

// --- API Handlers ---

const NOTIFY_DAILY_LIMIT = 10; // Max 10 notify requests per day
const NOTIFY_DAILY_KEY = 'quota:notify:daily';

async function handleNotifyUpdate(request, env) {
  if (!verifyAuth(request, env))
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });

  // W3: Rate limiting — max 10 notify requests per day
  const dKey = dayKey();
  const notifyDailyKey = `${NOTIFY_DAILY_KEY}:${dKey}`;
  const notifyCount = await env.DEVICE_TOKENS.get(notifyDailyKey, 'json') || 0;
  if (notifyCount >= NOTIFY_DAILY_LIMIT) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded', retryAfter: '86400' }), { status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });
  }
  // Increment notify counter
  await env.DEVICE_TOKENS.put(notifyDailyKey, JSON.stringify(notifyCount + 1), {
    expirationTtl: 86400, // auto-expire after 1 day
  });

  const body = await request.json();
  const version = body.version;
  if (!version)
    return new Response(JSON.stringify({ error: 'Missing version' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });

  // W1: Pagination support — loop using cursor
  const EXPO_PUSH_URL = env.EXPO_PUSH_URL || 'https://exp.host/--/api/v2/push/send';
  const MAX_DEVICES = 5000;
  const tokens = [];
  let cursor;
  do {
    const listOpts = { limit: 1000 };
    if (cursor) listOpts.cursor = cursor;
    const tokenList = await env.DEVICE_TOKENS.list(listOpts);
    for (const key of tokenList.keys) {
      const entry = await env.DEVICE_TOKENS.get(key.name, 'json');
      if (entry) tokens.push({ token: key.name, ...entry });
      if (tokens.length >= MAX_DEVICES) break;
    }
    cursor = tokenList.list_complete ? undefined : tokenList.cursor;
  } while (cursor && tokens.length < MAX_DEVICES);

  if (tokens.length === 0)
    return new Response(JSON.stringify({ ok: true, notifiedCount: 0, failureCount: 0 }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });

  let successCount = 0, failureCount = 0;
  const invalidTokens = [];
  for (const device of tokens) {
    try {
      // W4: Add AbortSignal.timeout(5000) to prevent hanging
      const res = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ to: device.token, title: '', body: '', data: { type: 'geojson-update', version }, priority: 'default', _displayInForeground: false }),
        signal: AbortSignal.timeout(5000),
      });
      const result = await res.json();
      if (result.data?.status === 'ok') successCount++;
      else { failureCount++; if (result.data?.details?.error === 'DeviceNotRegistered') invalidTokens.push(device.token); }
    } catch { failureCount++; }
  }
  for (const token of invalidTokens) await env.DEVICE_TOKENS.delete(token);

  await incrCounter(env, monthKey(), 'writes');
  await incrCounter(env, dayKey(), 'writes');

  return new Response(JSON.stringify({ ok: true, notifiedCount: successCount, failureCount }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });
}

async function handleRegisterDevice(request, env) {
  if (!verifyAuth(request, env))
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });
  const { token, platform, appVersion } = await request.json();
  if (!token)
    return new Response(JSON.stringify({ error: 'Missing token' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });
  await env.DEVICE_TOKENS.put(token, JSON.stringify({ platform: platform || 'unknown', appVersion: appVersion || 'unknown', registeredAt: new Date().toISOString() }));
  return new Response(JSON.stringify({ ok: true, token }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });
}

async function handleUnregisterDevice(request, env) {
  if (!verifyAuth(request, env))
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });
  const { token } = await request.json();
  if (!token)
    return new Response(JSON.stringify({ error: 'Missing token' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });
  await env.DEVICE_TOKENS.delete(token);
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });
}

async function handleQuotaStatus(request, env) {
  const quota = await checkQuota(env);
  const status = quota.blocked ? 'blocked' : quota.warning ? 'warning' : 'ok';
  return new Response(JSON.stringify({ status, ...quota }), {
    status: quota.blocked ? 503 : 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

async function handleR2Proxy(request, env) {
  const url = new URL(request.url);
  const key = url.pathname.replace(/^\/data\//, '');
  if (!key)
    return new Response(JSON.stringify({ error: 'Missing key' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });

  // C1: Path traversal prevention — reject dangerous keys
  if (key.includes('..') || !/^[a-zA-Z0-9._\/-]+$/.test(key)) {
    return new Response(JSON.stringify({ error: 'Invalid key' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });
  }

  // クォータ超過チェック
  const quota = await checkQuota(env);
  if (quota.blocked) {
    return new Response(JSON.stringify({ error: 'Quota exceeded', retryAfter: 'next billing cycle', quota: quota.monthly, limits: quota.limits }), {
      status: 503,
      headers: { 'Content-Type': 'application/json', 'X-Quota-Exceeded': 'true', 'Retry-After': '86400', ...corsHeaders() },
    });
  }

  try {
    const object = await env.GEO_DATA.get(key);
    if (!object)
      return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });

    // 利用量カウント (R2 get は Class B 操作)
    const body = await object.arrayBuffer();
    await incrCounter(env, monthKey(), 'reads');
    await incrCounter(env, dayKey(), 'reads');
    await addBandwidth(env, monthKey(), body.byteLength);
    await addBandwidth(env, dayKey(), body.byteLength);

    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'application/json; charset=utf-8');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    if (quota.warning) headers.set('X-Quota-Warning', 'true');
    headers.set('X-Quota-Usage', `${quota.monthly.reads + quota.monthly.writes}/${quota.limits.monthly}`);
    headers.set('X-Quota-Daily', `${quota.daily.reads + quota.daily.writes}/${quota.limits.daily}`);

    return new Response(body, { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal Error' }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });
  }
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS')
      return new Response(null, { status: 204, headers: corsHeaders() });

    const url = new URL(request.url);
    const path = url.pathname;

    // R2 プロキシ
    if (request.method === 'GET' && path.startsWith('/data/'))
      return handleR2Proxy(request, env);

    // クォータ状態 API
    if (request.method === 'GET' && path === '/api/quota-status')
      return handleQuotaStatus(request, env);

    if (request.method === 'POST') {
      if (path === '/api/notify-update')   return handleNotifyUpdate(request, env);
      if (path === '/api/register-device')  return handleRegisterDevice(request, env);
      if (path === '/api/unregister-device') return handleUnregisterDevice(request, env);
    }

    if (request.method === 'GET' && path === '/health')
      return new Response(JSON.stringify({ status: 'ok' }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });

    return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });
  },
};
