---
agent: IMP
task_id: TASK-studyhall-layers
date: 2026-07-15
status: success
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-studyhall-layers](../shared/tasks/active/TASK-studyhall-layers.md)"
tags:
  - IMP
  - implementation
  - TASK-studyhall-layers
---

# Implementation Log: Surface Layers for studyhall

## Summary

ARC のインターフェース仕様に基づき、studyhall の surface 描画レイヤーを実装した。

## Changes Made

### 1. Asset Copy
- Copied `tools/map-assets/build/imdf/studyhall/surface/{1F,2F,3F,4F,5F}.json` → `mobile/assets/maps/imdf/studyhall/surface/`

### 2. manifest.json
- Added 5 surface entries (`studyhall_surface_floor1` ~ `studyhall_surface_floor5`)
- Updated `count`: 22 → 27
- Updated `totalSize`: 601296 → 624941

### 3. geojsonAssetMap.ts
- Added 5 imports for surface GeoJSON files
- Added 5 entries to `geoJsonMap`

### 4. colorPalette.ts
- Added `surface: RoomCategoryPalette` to `ColorTheme` type
- LIGHT_THEME: `{ fill: "#FBF8F2", line: "#E5DDD0", opacity: 1.0 }`
- DARK_THEME: `{ fill: "#2C2824", line: "#4A443D", opacity: 1.0 }`

### 5. useBatchMapData.ts
- Extended `FloorGeoData` type: added `surface` and `underlaySurface`
- Added `floorSurfaceId()` helper function
- Updated preload to fetch surface data (15 records: 5 floors × 3 types)
- Set `underlaySurface` for floors 4/5 from floor 3's cached surface
- Updated main useEffect to load surface and set underlaySurface

### 6. SurfaceLayer component (NEW)
- Created `src/features/home/map/layers/floor/surface/index.tsx`
- Accepts `palette` prop, renders `PolygonLayer` with fill/line style

### 7. FloorView (index.tsx)
- Removed `SectionView` import and old sections-as-surface workaround
- Added `SurfaceLayer` import
- New structure: underlaySurface → SurfaceLayer (opacity:0.5 for 4F/5F) → SurfaceLayer (current floor) → UnitView

### 8. floor/types.ts
- Updated `FloorProps` type: added `surface` and optional `underlaySurface`

## Verification
- `npx tsc --noEmit`: No new errors (pre-existing errors unrelated to changed files)
- All changed files pass type checking

## Files Changed
| File | Action |
|---|---|
| `mobile/assets/maps/imdf/studyhall/surface/{1F,2F,3F,4F,5F}.json` | Copied |
| `mobile/assets/maps/manifest.json` | Edited |
| `mobile/src/data/geojson/geojsonAssetMap.ts` | Edited |
| `mobile/src/features/home/map/constants/colorPalette.ts` | Edited |
| `mobile/src/features/home/map/hooks/dataLoad/useBatchMapData.ts` | Edited |
| `mobile/src/features/home/map/layers/floor/surface/index.tsx` | Created |
| `mobile/src/features/home/map/layers/floor/index.tsx` | Edited |
| `mobile/src/features/home/map/layers/floor/types.ts` | Edited |
