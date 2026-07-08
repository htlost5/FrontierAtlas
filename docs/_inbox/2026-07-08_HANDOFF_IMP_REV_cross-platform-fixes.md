---
agent: IMP
task_id: TASK-cross-platform-fixes
date: 2026-07-08
status: pending
category: log
destination: logs/impl/implementation/
related: []
tags:
  - IMP
  - handoff
  - implementation
---

# HANDOFF: IMP → REV

## Metadata
| Field | Value |
|-------|-------|
| **From** | IMP |
| **To** | REV |
| **Task ID** | TASK-cross-platform-fixes |
| **Status** | success |
| **Confidence** | high |
| **Handoff Type** | forward |

---

## Task Context（継承・追記セクション）

### Original Request
Implement pure cross-platform fixes (no `Platform.OS`, no native modules):
1. Replace `AbortSignal.timeout` + `cache: "no-cache"` in `safeFetch` with `AbortController` + `setTimeout`/`clearTimeout`
2. Create `sanitizeGeoJSON.ts` utility to dedupe coordinates and filter degenerate polygons
3. Apply sanitization to both return paths in `getGeoDataByLogicalId.ts`

### Changes Made

| File | Action | Summary |
|------|--------|---------|
| `mobile/src/infra/network/fetchWrapper.ts` | Modified | Removed `cache: "no-cache"`, replaced `AbortSignal.timeout` with `AbortController` + `setTimeout`/`clearTimeout` + `try/finally` |
| `mobile/src/infra/geojson/sanitizeGeoJSON.ts` | Created | `sanitizeFeatureCollection(fc)` — dedupes consecutive near-equal coords (epsilon 1e-12), filters degenerate polygons, ensures closed rings |
| `mobile/src/features/home/map/services/getGeoDataByLogicalId.ts` | Modified | Added import & applied `sanitizeFeatureCollection` on both SQLite-cache-hit and asset-fallback return paths |

### Constraints
- No `Platform.OS`, `Platform.select`, or `NativeModules` references anywhere
- No new npm dependencies
- All 3 files verified: 0 compile/lint errors

### Chain History
| Step | Agent | Status | Summary |
|------|-------|--------|---------|
| 1 | IMP | done | Implemented all 3 changes, verified zero errors, logged to `logs/impl/implementation/2026-07-08_IMP_cross-platform-fixes.md` |

---

## Key Decisions

1. **`AbortController` over `AbortSignal.timeout`**: Prevents timeout memory leak — `clearTimeout` in `finally` guarantees cleanup even after successful fetch.
2. **No `Platform.OS` branching**: Sanitization is applied unconditionally on all platforms. The `sanitizeGeoJSON.ts` utility is pure TypeScript with zero platform dependencies — identical behavior on iOS and Android.
3. **EPSILON = 1e-12**: Matches existing dedup in `transform.js` for consistency.

---

## Artifacts

### Changed Files
- `mobile/src/infra/network/fetchWrapper.ts`
- `mobile/src/infra/geojson/sanitizeGeoJSON.ts` (new)
- `mobile/src/features/home/map/services/getGeoDataByLogicalId.ts`

### Logs
- `docs/logs/impl/implementation/2026-07-08_IMP_cross-platform-fixes.md`

---

## Verification Checklist

- [ ] Zero TypeScript compile errors in all changed files
- [ ] Zero lint errors in all changed files
- [ ] No `Platform.OS`, `Platform.select`, or `NativeModules` references
- [ ] No new npm dependencies introduced
- [ ] `AbortSignal.timeout` fully removed from `fetchWrapper.ts`
- [ ] `cache: "no-cache"` fully removed from `fetchWrapper.ts`
- [ ] `sanitizeFeatureCollection` imported and applied in `getGeoDataByLogicalId.ts`

---

## Open Questions

None.

---

## Routing

| Next Agent | Action |
|------------|--------|
| **REV** | Review code changes for correctness, cross-platform safety, and coding principles compliance |
| REV → TST | If approved, hand off for testing |

---

*HANDOFF prepared by IMP — 2026-07-08*
