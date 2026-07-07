// Cloudflare Worker: GeoJSON Push + R2 Proxy
// POST /api/notify-update   — CI/CDからの更新通知
// POST /api/register-device  — デバイストークン登録
// POST /api/unregister-device — デバイストークン解除
// GET  /data/*               — R2 プロキシ (meta/latest.json 等)

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'public, max-age=3600',
  };
}

function verifyAuth(request, env) {
  const auth = request.headers.get('Authorization');
  return auth === `Bearer ${env.API_KEY}`;
}

async function handleNotifyUpdate(request, env) {
  if (!verifyAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
  const body = await request.json();
  const version = body.version;
  if (!version) {
    return new Response(JSON.stringify({ error: 'Missing version' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
  const tokenList = await env.DEVICE_TOKENS.list();
  const tokens = [];
  for (const key of tokenList.keys) {
    const entry = await env.DEVICE_TOKENS.get(key.name, 'json');
    if (entry) tokens.push({ token: key.name, ...entry });
  }
  if (tokens.length === 0) {
    return new Response(JSON.stringify({ ok: true, notifiedCount: 0, failureCount: 0 }), {
      status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
  let successCount = 0, failureCount = 0;
  const invalidTokens = [];
  for (const device of tokens) {
    try {
      const res = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          to: device.token, title: '', body: '',
          data: { type: 'geojson-update', version },
          priority: 'default', _displayInForeground: false,
        }),
      });
      const result = await res.json();
      if (result.data?.status === 'ok') {
        successCount++;
      } else {
        failureCount++;
        if (result.data?.details?.error === 'DeviceNotRegistered') {
          invalidTokens.push(device.token);
        }
      }
    } catch { failureCount++; }
  }
  for (const token of invalidTokens) {
    await env.DEVICE_TOKENS.delete(token);
  }
  return new Response(JSON.stringify({ ok: true, notifiedCount: successCount, failureCount }), {
    status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

async function handleRegisterDevice(request, env) {
  if (!verifyAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
  const body = await request.json();
  const { token, platform, appVersion } = body;
  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing token' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
  await env.DEVICE_TOKENS.put(token, JSON.stringify({
    platform: platform || 'unknown',
    appVersion: appVersion || 'unknown',
    registeredAt: new Date().toISOString(),
  }));
  return new Response(JSON.stringify({ ok: true, token }), {
    status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

async function handleUnregisterDevice(request, env) {
  if (!verifyAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
  const body = await request.json();
  const { token } = body;
  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing token' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
  await env.DEVICE_TOKENS.delete(token);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

// R2 プロキシ: GET /data/* → R2 からオブジェクトを取得して返す
async function handleR2Proxy(request, env) {
  const url = new URL(request.url);
  const key = url.pathname.replace(/^\/data\//, '');
  if (!key) {
    return new Response(JSON.stringify({ error: 'Missing object key' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
  try {
    const object = await env.GEO_DATA.get(key);
    if (!object) {
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders() },
      });
    }
    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'application/json; charset=utf-8');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    if (object.httpMetadata?.contentEncoding) {
      headers.set('Content-Encoding', object.httpMetadata.contentEncoding);
    }
    return new Response(object.body, { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal Error' }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }
    const url = new URL(request.url);
    const path = url.pathname;

    // R2 プロキシ
    if (request.method === 'GET' && path.startsWith('/data/')) {
      return handleR2Proxy(request, env);
    }

    if (request.method === 'POST') {
      if (path === '/api/notify-update') return handleNotifyUpdate(request, env);
      if (path === '/api/register-device') return handleRegisterDevice(request, env);
      if (path === '/api/unregister-device') return handleUnregisterDevice(request, env);
    }

    if (request.method === 'GET' && path === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders() },
      });
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  },
};
