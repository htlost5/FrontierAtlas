---
agent: IMP
task_id: TASK-code-review-fixes
date: 2026-07-08
status: pending
category: log
destination: logs/impl/implementation/2026-07-08_IMP_code-review-fixes.md
related:
  - "[Code Review Fixes Task]"
tags:
  - IMP
  - implementation
  - code-review
  - frontieratlas
---

# Implementation Log: FrontierAtlas Code Review Fixes (20 items)

All 20 items from the code review have been implemented and verified (zero errors).

## CRITICAL Fixes (3/3)

| ID | File | Change |
|----|------|--------|
| C1 | `tools/worker-push/index.js` | Added path traversal prevention in `handleR2Proxy`: rejects keys with `..` or chars outside `[a-zA-Z0-9._/-]`, returns 400 |
| C2 | `tools/worker-push/index.js` | Added `metadata` field to KV `put()` calls in `incrCounter` and `addBandwidth`; added WARNING comments about race condition and recommendation to migrate to D1/DO |
| C3 | `mobile/src/features/home/map/MapScreen.tsx` | Early return when `hasFatalError` — renders only `LoadingOverlay` + retry button, blocks all child components (VenueView, FloorView, MapIconLabel, BuildingsView) |

## WARNING Fixes (17/17)

| ID | File | Change |
|----|------|--------|
| W1 | `tools/worker-push/index.js` | Added cursor-based pagination loop in `handleNotifyUpdate` with `MAX_DEVICES=5000` limit |
| W2 | `tools/worker-push/index.js` | Removed hardcoded `const EXPO_PUSH_URL`; now reads from `env.EXPO_PUSH_URL` with fallback |
| W3 | `tools/worker-push/index.js` | Added rate limiting: daily KV counter, max 10/day, returns 429 if exceeded |
| W4 | `tools/worker-push/index.js` | Added `AbortSignal.timeout(5000)` to push API `fetch()` call |
| W5 | `wrangler.toml` + `tools/worker-push/index.js` | Added comment in wrangler.toml about `API_KEY` secret; added `env.API_KEY` check in `verifyAuth` |
| W6 | `mobile/src/features/home/map/renderers/MapIconLabel.tsx` | Added type guard `f is typeof f & { properties: NonNullable<...> }` in `.filter()` |
| W7-9 | `mobile/src/data/geojson/repository/GeojsonRepository.ts` | Removed unused imports: `MapId`, `BuildManifest`, `LocalManifestFiles` |
| W10 | `mobile/src/data/geojson/repository/GeojsonRepository.ts` | Changed `Array<{...}>` to `{...}[]` in `upsertMany` |
| W11 | `mobile/src/data/geojson/repository/GeojsonRepository.ts` | Changed `Array<{...}>` to `{...}[]` in `getFailures` |
| W12-13 | `mobile/src/domain/manifestTypes.ts` | Removed unused `Feature`, `FeatureCollection` imports |
| W14 | `mobile/src/features/home/map/renderers/MapIconLabel.tsx` | Rewrote file as UTF-8 without BOM |
| W15 | `mobile/src/features/home/map/services/getGeoDataByLogicalId.ts` | Merged duplicate `geojsonAssetMap` imports into single statement |
| W16 | `mobile/src/features/home/map/MapScreen.tsx` | Added "再試行" retry button (Pressable/Text) when `hasFatalError`; `handleRetry` resets error state |
| W17 | `mobile/src/infra/network/fetchWrapper.ts` | Added `AbortSignal.timeout(15000)` with configurable `timeoutMs` parameter |
| W18 | `mobile/src/data/urls.ts` | Added TODO comment above `REMOTE_BASE_URL` about switching to Worker proxy |
| W19 | `mobile/src/features/home/map/MapScreen.tsx` | Added `prevZoomRef` to track zoom; only calls `setZoom(z)` on actual change |
| W20 | `mobile/src/features/home/map/MapScreen.tsx` | Separated `isFloorDataReady` from stairs dependency; floor renders based on geoData availability alone |

## Verification

- All 8 modified TypeScript/TSX files: **zero errors**
- Worker JS: **zero errors**
- Wrangler TOML: **no syntax issues**

## Modified Files

1. `d:\htlost5-workspace\projects\frontieratlas\tools\worker-push\index.js`
2. `d:\htlost5-workspace\projects\frontieratlas\wrangler.toml`
3. `d:\htlost5-workspace\projects\frontieratlas\mobile\src\features\home\map\MapScreen.tsx`
4. `d:\htlost5-workspace\projects\frontieratlas\mobile\src\features\home\map\renderers\MapIconLabel.tsx`
5. `d:\htlost5-workspace\projects\frontieratlas\mobile\src\data\geojson\repository\GeojsonRepository.ts`
6. `d:\htlost5-workspace\projects\frontieratlas\mobile\src\domain\manifestTypes.ts`
7. `d:\htlost5-workspace\projects\frontieratlas\mobile\src\features\home\map\services\getGeoDataByLogicalId.ts`
8. `d:\htlost5-workspace\projects\frontieratlas\mobile\src\infra\network\fetchWrapper.ts`
9. `d:\htlost5-workspace\projects\frontieratlas\mobile\src\data\urls.ts`
