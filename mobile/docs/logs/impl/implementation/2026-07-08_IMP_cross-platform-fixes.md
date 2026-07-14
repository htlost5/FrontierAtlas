---
agent: IMP
task_id: TASK-cross-platform-fixes
date: 2026-07-08
status: done
category: log
destination: logs/impl/implementation/
related:
  - "[TASK-cross-platform-fixes]"
tags:
  - IMP
  - implementation
  - cross-platform
  - safeFetch
  - geoJSON
  - sanitize
---

# Implementation Log: Pure Cross-Platform Fixes

## Summary
Implemented three pure cross-platform fixes — no `Platform.OS`, no native modules, no new dependencies.

## Changes Made

### 1. `mobile/src/infra/network/fetchWrapper.ts` — `safeFetch` refactor
- Removed `cache: "no-cache"` (unnecessary header)
- Replaced `AbortSignal.timeout()` with `new AbortController()` + `setTimeout` + `clearTimeout`
- Added `try/finally` to ensure `clearTimeout` always runs
- Reason: `AbortSignal.timeout()` leaks the timeout if the fetch completes normally; manual controller guarantees cleanup

### 2. NEW FILE `mobile/src/infra/geojson/sanitizeGeoJSON.ts`
- Created `sanitizeFeatureCollection()` utility
- Deduplicates consecutive near-equal coordinates per ring (epsilon = 1e-12)
- Filters out degenerate polygons (ring < 4 coords after dedup)
- Ensures rings are properly closed
- Handles Polygon, MultiPolygon, and GeometryCollection recursively
- Passes through Point, LineString, MultiPoint, MultiLineString unchanged
- Prevents MapLibre Native earcut triangulation crash on Android

### 3. `mobile/src/features/home/map/services/getGeoDataByLogicalId.ts` — Sanitization applied
- Added import: `sanitizeFeatureCollection`
- Applied `sanitizeFeatureCollection()` on both return paths (SQLite cache hit + asset fallback)

## Verification
- All 3 files: 0 compile/lint errors
- No `Platform.OS`, `Platform.select`, or `NativeModules` references in any changed file
- No new npm dependencies required

## Files Changed
| File | Action |
|------|--------|
| `mobile/src/infra/network/fetchWrapper.ts` | Modified |
| `mobile/src/infra/geojson/sanitizeGeoJSON.ts` | Created |
| `mobile/src/features/home/map/services/getGeoDataByLogicalId.ts` | Modified |
