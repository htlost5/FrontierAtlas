---
agent: IMP
task_id: TASK-{ID}
date: 2026-07-12
status: draft
category: log
destination: logs/impl/implementation/
tags:
  - IMP
  - floor-surface
---

# Implementation Log: Floor Surface Polygon Layer

## Summary
Added a floor surface polygon layer to `FloorView` that renders between the venue and unit/section layers, using the buildings color palette.

## Changes

### File Modified
- `mobile/src/features/home/map/layers/floor/index.tsx`

### What Changed
1. **Added imports**:
   - `PolygonLayer` from `../../components/mapComp/PolygonLayer`
   - `getBuildingsFillStyle, getBuildingsLineStyle` from `../buildings/style`

2. **Added PolygonLayer** before `SectionView` and `UnitView`:
   - `prefixId="floorSurface"`
   - `data={floorData.sections}` (reuses floor outline geometry)
   - `visible={visible}` (inherited from FloorProps)
   - `fillStyle={getBuildingsFillStyle(colorTheme.buildings)}` → `#E8E8EC` at 0.8 opacity
   - `lineStyle={getBuildingsLineStyle(colorTheme.buildings)}` → `#D4D4D8` at 1.5px width

### Rendering Order (updated)
```
VenueView → FloorSurface (new) → SectionView → UnitView → UnitSymbol → MapIconLabel → BuildingsView
```

## Verification
- Imports verified: `PolygonLayer` component exists; `getBuildingsFillStyle`/`getBuildingsLineStyle` exist in `buildings/style.ts`
- No other files modified
