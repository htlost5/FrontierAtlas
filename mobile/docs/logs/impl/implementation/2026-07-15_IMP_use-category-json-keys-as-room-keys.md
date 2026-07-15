---
agent: IMP
task_id: TASK-room-keys-001
date: 2026-07-15
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-room-keys-001](../shared/tasks/active/TASK-room-keys-001_use-category-json-keys-as-room-keys.md)"
tags:
  - IMP
  - implementation
  - TASK-room-keys-001
---

# Implementation Log: Use category.json Keys as Direct Room Key IDs

## Summary

Eliminated the intermediate camelCase key layer. category.json keys are now used directly as room keys throughout the entire codebase. `ROOM_CATEGORIES` values became `string[]` arrays, making it the single mapping source and replacing `CATEGORY_CONFIG_TO_GEOJSON`.

## Changes Made

### 1. `filter.ts` — ROOM_CATEGORIES rewritten

| Before | After |
|---|---|
| Keys: camelCase (studyRoom) | Keys: category.json keys (study_room) |
| Values: single string | Values: `string[]` array |
| `filterMaker` import used | Removed |
| `ROOM_FILTERS` exported | Removed |

```typescript
// Before
studyRoom: "study_room",
preparationRoom: "preparation_room",
emergencyExit: "emergency_exit",
vendingMachine: "vending_machine",
locker: "locker",

// After
study_room: ["study_room"],
prep_room: ["preparation_room", "chemical_prep_room"],
emergency_exit: ["emergency_exit", "emergency_area", "evacuation_exit"],
vending: ["vending_machine", "vending_area"],
locker_area: ["locker_room", "locker"],
```

**Mapping alignment with category.json**: Each key in `ROOM_CATEGORIES` now equals a key in `category.json` (structure excluded). No camelCase aliases. All 38 entries from category.json are represented.

### 2. `configs.ts` — ROOM_CATEGORY_MAP + buildCategoryFilter rewritten

- Keys changed from camelCase to category.json keys
- `EXCLUDED_CATEGORIES` removed entirely (was already empty)
- `buildCategoryFilter` uses `flatMap` to handle array values, using `isFeatureVisible` directly (no EXCLUDED_CATEGORIES check)

### 3. `categoryDisplayConfig.ts` — CATEGORY_CONFIG_TO_GEOJSON eliminated

- Import now reads `ROOM_CATEGORIES` and `RoomKey` from `filter.ts`
- `GEOJSON_TO_CONFIG_KEY` reverse map built from `ROOM_CATEGORIES` entries directly
- `CATEGORY_CONFIG_TO_GEOJSON` export removed
- `getGeoJsonCategoryFromConfigKey()` removed (no longer needed; use `ROOM_CATEGORIES[key][0]` or iterate directly)
- `getPoiGeoJsonCategories()` reads from `ROOM_CATEGORIES` + `RAW_CATEGORIES` directly (no CATEGORY_CONFIG_TO_GEOJSON indirection)

### 4. `config/index.ts` — Exports cleaned

- Removed `getGeoJsonCategoryFromConfigKey` and `CATEGORY_CONFIG_TO_GEOJSON` from re-exports

### 5. `LabelConfigs.ts` — Updated to handle array values

- `buildLabelOverrides()` changed from `.map()` + `.filter(Boolean)` to `.flatMap()` for GeoJSON value collection

### Files NOT modified (verified no changes needed)

- `UnitSymbol.tsx` — still uses raw GeoJSON values; `buildPoiFilter()` → `getPoiGeoJsonCategories()` now reads from `ROOM_CATEGORIES` automatically
- `rooms/index.tsx` — uses `CATEGORIES`/`buildCategoryFilter` from configs.ts (compatible)
- `unit/index.tsx` — passes through to RoomView/BaseView (no room key references)
- `bases/filters.ts` — independent `filterMaker` usage for BASE_CATEGORIES only
- `categoryNormalizer.ts` — imports `normalizeCategory` which was unchanged
- `category.json` — source of truth, untouched

## Verification

| Check | Result |
|---|---|
| `filter.ts` TypeScript errors | ✅ 0 errors |
| `configs.ts` TypeScript errors | ✅ 0 errors |
| `categoryDisplayConfig.ts` TypeScript errors | ✅ 0 errors |
| `config/index.ts` TypeScript errors | ✅ 0 errors |
| `LabelConfigs.ts` TypeScript errors | ✅ 0 errors |
| Removed exports (`ROOM_FILTERS`, `EXCLUDED_CATEGORIES`, `CATEGORY_CONFIG_TO_GEOJSON`, `getGeoJsonCategoryFromConfigKey`) referenced elsewhere | ⚠️ No remaining imports — all clean |
| `RoomKey` type = `keyof typeof ROOM_CATEGORIES` = category.json key union | ✅ |

## Key Design Decisions

1. **Roof over prep_room**: `preparation_room` and `chemical_prep_room` were previously separate keys (preparationRoom, chemicalPrepRoom). Now consolidated under `prep_room: ["preparation_room", "chemical_prep_room"]` matching category.json's single `prep_room` entry.

2. **Locker/locker_area merge**: `locker` (standalone GeoJSON) and `locker_room` (GeoJSON) are now both under `locker_area: ["locker_room", "locker"]`, matching the old `CATEGORY_CONFIG_TO_GEOJSON` mapping and category.json's `locker_area` key.

3. **Vending merge**: `vending_machine` and `vending_area` under `vending: ["vending_machine", "vending_area"]` matching category.json's `vending` key.

4. **Emergency exit merge**: `emergency_exit`, `emergency_area`, `evacuation_exit` under `emergency_exit: ["emergency_exit", "emergency_area", "evacuation_exit"]` matching category.json's `emergency_exit` key.

5. **information_lounge merge**: `information_lounge` and `information_corner` under `information_lounge: ["information_lounge", "information_corner"]` matching category.json's `information_lounge` key.
