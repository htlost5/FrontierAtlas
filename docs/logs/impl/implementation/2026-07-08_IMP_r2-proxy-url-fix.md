---
agent: IMP
task_id: TASK-r2-proxy-url-fix
date: 2026-07-08
status: approved
category: log
destination: logs/impl/implementation/
related:
  - "[urls.ts](../../../../mobile/src/data/urls.ts)"
tags:
  - IMP
  - implementation
  - url-fix
  - r2-proxy
---

# Implementation Log: R2 direct URL → Worker proxy URL

## Task

R2 の直接公開URL (`pub-d8f5948d1eee41aea5ea49d6578710cb.r2.dev`) が応答しなくなったため、`REMOTE_BASE_URL` をデプロイ済みの Worker proxy URL に変更する。

## Changes Made

### File: `mobile/src/data/urls.ts`

**Before:**
```typescript
// R2 + Worker 経由のURL
// Worker が R2 バケットへのプロキシとして機能する
// TODO: Switch to Worker proxy URL once the proxy is deployed.
// The proxy provides auth, quota management, and caching headers.
// Proxy path TBD — update this after proxy deployment.
export const REMOTE_BASE_URL = "https://pub-d8f5948d1eee41aea5ea49d6578710cb.r2.dev";
// R2 公開アクセス有効化後はカスタムドメインに切り替え:
// export const REMOTE_BASE_URL = "https://geo-data.frontieratlas.dev";
```

**After:**
```typescript
// R2 + Worker 経由のURL
// Worker が R2 バケットへのプロキシとして機能する
// Worker proxy is deployed — provides CORS, Cache-Control, and quota management.
export const REMOTE_BASE_URL = "https://geo-data-push.htlost8.workers.dev/data";
```

## Derived URLs (unchanged, derived from `REMOTE_BASE_URL`)

| Variable | Value |
|---|---|
| `LATEST_URL` | `https://geo-data-push.htlost8.workers.dev/data/meta/latest.json` |
| `RELEASES_URL` | `https://geo-data-push.htlost8.workers.dev/data/releases` |

## Validation

- Old R2 URL (`pub-d8f5948d1eee41aea5ea49d6578710cb`) — no remaining references in codebase ✅
- `LATEST_URL` resolves correctly via template string ✅
- `RELEASES_URL` resolves correctly via template string ✅
- Worker at `tools/worker-push/index.js` proxies `/data/*` to R2 (line ~210) ✅
- Only one file changed — no other files need updates ✅

## Context

- Worker (`tools/worker-push/index.js`) handles `/data/` path as R2 proxy with CORS headers, `Cache-Control: public, max-age=31536000, immutable`, quota management, and quota headers.
- GitHub Actions (`release-geo-data.yml`) uploads to R2 directly via `wrangler r2 object put` — no changes needed.
