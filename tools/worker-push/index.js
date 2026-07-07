// Cloudflare Worker: GeoJSON Push + R2 Proxy + Quota Management
const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

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
  const auth = request.headers.get('Authorization');
  return auth === `Bearer ${env.API_KEY}`;
}

// 現在の月キーと日キーを取得
function monthKey() { const d = new Date(); return `quota:${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`; }
function dayKey()   { const d = new Date(); return `quota:daily:${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`; }

// カウンターインクリメント (KV)
async function incrCounter(env, key, field) {
  const raw = await env.DEVICE_TOKENS.get(key, 'json') || { reads: 0, writes: 0, bandwidthKB: 0 };
  raw[field] = (raw[field] || 0) + 1;
  await env.DEVICE_TOKENS.put(key, JSON.stringify(raw));
  return raw;
}

// データサイズから帯域を計算して加算
async function addBandwidth(env, key, bytes) {
  const raw = await env.DEVICE_TOKENS.get(key, 'json') || { reads: 0, writes: 0, bandwidthKB: 0 };
  raw.bandwidthKB = (raw.bandwidthKB || 0) + Math.ceil(bytes / 1024);
  await env.DEVICE_TOKENS.put(key, JSON.stringify(raw));
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

async function handleNotifyUpdate(request, env) {
  if (!verifyAuth(request, env))
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });

  const body = await request.json();
  const version = body.version;
  if (!version)
    return new Response(JSON.stringify({ error: 'Missing version' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });

  const tokenList = await env.DEVICE_TOKENS.list();
  const tokens = [];
  for (const key of tokenList.keys) {
    const entry = await env.DEVICE_TOKENS.get(key.name, 'json');
    if (entry) tokens.push({ token: key.name, ...entry });
  }
  if (tokens.length === 0)
    return new Response(JSON.stringify({ ok: true, notifiedCount: 0, failureCount: 0 }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });

  let successCount = 0, failureCount = 0;
  const invalidTokens = [];
  for (const device of tokens) {
    try {
      const res = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ to: device.token, title: '', body: '', data: { type: 'geojson-update', version }, priority: 'default', _displayInForeground: false }),
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
