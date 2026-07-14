---
agent: IMP
task_id: TASK-000
date: 2026-07-12
status: draft
category: log
destination: docs/logs/impl/implementation/
tags:
  - IMP
  - bugfix
  - sqlite
  - maplibre
---

# Implementation Log: NativeDatabase crash + glyph 404 fix

## Bug 1: SQLite NativeDatabase crash in `preloadAllFloors()`

**File**: `src/features/home/map/hooks/dataLoad/useBatchMapData.ts`

**Problem**: `preloadAllFloors()` called `Promise.all` with 10 `getGeoDataByLogicalId()` calls, each going through `geojsonRegistry.has()` → `geojsonRegistry.get()` — 20 simultaneous native SQLite calls. Android's expo-sqlite bridge released the shared NativeDatabase object under this concurrency.

**Fix**: Replaced `Promise.all` × 10 individual calls with a single `GeojsonRepository.getInstance().getMany(allIds)` batch query (1 `getAllAsync` call).

**Changes**:
1. Added imports: `GeojsonRepository`, `sanitizeFeatureCollection`, `geoJsonMap`
2. Rewrote `preloadAllFloors()` to use `repo.getMany(allIds)` + asset bundle fallback with `geoJsonMap` + `sanitizeFeatureCollection`

## Bug 2: MapLibre glyph 404 spam

**File**: `src/features/home/map/components/MapContainer.tsx`

**Problem**: `mapStyle` had `glyphs` pointing to demotiles.maplibre.org with CJK-unavailable font ranges, and `metadata` with `localIdeographFontFamily`. No text layers exist — all labels are React Native `MarkerView`. MapLibre Native still tried to preload CJK glyphs → 404 for every range.

**Fix**: Removed `glyphs` and `metadata` from the `mapStyle` object. Added comment explaining the intentional omission.

## Verification

- `useBatchMapData.ts`: No TypeScript errors
- `MapContainer.tsx`: No TypeScript errors
- No new dependencies
- No new files (except this log)

## Handoff to REV

Both fixes are ready for review.
