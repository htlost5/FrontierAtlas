---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-15
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-001](../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - IMP
  - implementation
  - refactor
  - TASK-compass-001
---

# Implementation Log: Strip Room Categories to category.json Only

## Summary

`ROOM_CATEGORIES` (filter.ts) and `ROOM_CATEGORY_MAP` (configs.ts) were trimmed from ~77 entries down to only the 44 entries whose GeoJSON values are referenced in `CATEGORY_CONFIG_TO_GEOJSON` (categoryDisplayConfig.ts), which is derived from `category.json`.

## Changes

### `mobile/src/features/home/map/layers/floor/unit/rooms/filter.ts`

**Before**: 77 entries in `ROOM_CATEGORIES`
**After**: 44 entries

Deleted 36 entries not covered by `CATEGORY_CONFIG_TO_GEOJSON`:
- learning: `callRoom`, `seminarRoom`, `talkRoom`, `selfStudyRoom`, `lectureRoom`
- laboratory: `chemistryLab`, `physicsLab`, `biologyLab`, `environmentLab`, `earthScienceLab`, `nanoLab`, `electronMicroscopeLab`, `analysisLab`, `environmentLifeLab`, `biochemistryLab`, `darkroom`, `cleanBench`, `researchLab`
- creative: `metalWoodWorkingRoom`, `homeEconomicsRoom`, `presentationStudio`, `instrumentRoom`, `practiceRoom`
- meeting: `japaneseRoom`, `careerCounselingRoom`, `privateLounge`, `receptionRoom`
- staff: `office`, `principalRoom`, `lecturerStaffRoom`, `teacherStaffRoom`, `librarianRoom`, `advisorRoom`, `ptaRoom`
- social: `studentCouncilRoom`, `alumniRoom`
- circulation: `entrance`, `terrace`, `warehouse`, `bookStorage`, `garbageCollection`, `garden`, `balcony`, `generalRoom`, `concrete`

Added 3 new entries (GeoJSON values exist in category.json but were not in ROOM_CATEGORIES):
- `emergencyExit: "emergency_exit"`
- `vendingMachine: "vending_machine"`
- `locker: "locker"`

**`CATEGORY_NORMALIZE_MAP`**: No changes — all normalized values are still in the allowed set.

### `mobile/src/features/home/map/layers/floor/unit/rooms/configs.ts`

**`EXCLUDED_CATEGORIES`**: Changed from `new Set(["concrete", "general_room"])` to `new Set<string>()` (empty). The excluded values are no longer in `ROOM_CATEGORIES`, so the exclusion is redundant.

**`ROOM_CATEGORY_MAP`**: Trimmed from 77 entries to 44 entries, matching the new `ROOM_CATEGORIES`.

Added mappings for 3 new entries:
- `emergencyExit → "circulation"`
- `vendingMachine → "circulation"`
- `locker → "sanitary"` (consistent with `lockerRoom`)

## Files NOT Modified

- `categoryDisplayConfig.ts` — already correct
- `UnitSymbol.tsx` — all POI values (`restroom_male`, `restroom_female`, `restroom_accessible`, `elevator`, `vending_machine`, `locker`, `emergency_exit`) are in the allowed set
- `bases/filters.ts` — separate concern (BaseView)
- `category.json` — source of truth

## Verification

- `npx tsc --noEmit`: 0 new errors (2 pre-existing errors in `app.config.ts` and `MapContainer.tsx` unrelated to this change)
- All 44 GeoJSON values in new `ROOM_CATEGORIES` verified against the allowed set from `CATEGORY_CONFIG_TO_GEOJSON`
- `ROOM_CATEGORY_MAP` keys exactly match `ROOM_CATEGORIES` keys
- No dangling references — all deleted category keys had no external imports

## Open Questions

None.
