---
agent: IMP
task_id: TASK-fix-lint-warnings
date: 2026-07-08
status: approved
category: log
destination: logs/impl/implementation/
related:
  - "[MapScreen.tsx](../../../mobile/src/features/home/map/MapScreen.tsx)"
  - "[GeojsonRepository.ts](../../../mobile/src/data/geojson/repository/GeojsonRepository.ts)"
  - "[MapIconLabel.tsx](../../../mobile/src/features/home/map/renderers/MapIconLabel.tsx)"
tags:
  - IMP
  - lint
  - fix
---

# Fix 3 Remaining Lint Warnings

## Fix 1: Remove unused `BuildManifest` import

**File**: `mobile/src/data/geojson/repository/GeojsonRepository.ts`

Removed `BuildManifest` from the import statement on line 15. Only `LocalManifest` remains imported from `@/src/domain/manifestTypes`.

## Fix 2: Remove unused `isFloorReady` variable

**File**: `mobile/src/features/home/map/MapScreen.tsx`

Removed the line `const isFloorReady = isFloorDataReady && !!stairs;` (line 88). The variable was unused. The `isFloorDataReady` variable (separate concern) is preserved as it may still be in use.

## Fix 3: Remove BOM from MapIconLabel.tsx

**File**: `mobile/src/features/home/map/renderers/MapIconLabel.tsx`

Detected BOM bytes (EF BB BF) at the start of the file. Re-saved the file as UTF-8 without BOM using `[System.Text.UTF8Encoding]::new($false)`.

## Verification

- `npx expo lint` → no output (0 warnings)
- `npx tsc --noEmit` → no output (0 errors)

## Modified Files

1. `mobile/src/data/geojson/repository/GeojsonRepository.ts`
2. `mobile/src/features/home/map/MapScreen.tsx`
3. `mobile/src/features/home/map/renderers/MapIconLabel.tsx`
