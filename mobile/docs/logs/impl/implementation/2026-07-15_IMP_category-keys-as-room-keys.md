---
agent: IMP
task_id: TASK-category-string-001
date: 2026-07-15
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-category-string-001](../shared/tasks/active/TASK-category-string-001.md)"
tags:
  - IMP
  - implementation
  - TASK-category-string-001
---

# Implementation Log: Category string iteration bug fix

## Summary

`ROOM_CATEGORIES` values are strings, but consumer code treated them as arrays. This caused `.flatMap()` and `for...of` spread to iterate over individual characters instead of the full string value. Fixed all 4 consumer sites and removed dead normalization code.

## Changes

### 1. `filter.ts`
- Removed `ROOM_KEYS` export (unused)
- Removed `CATEGORY_NORMALIZE_MAP` and `normalizeCategory()` (dead code)

### 2. `categoryDisplayConfig.ts`
- **L37-42**: Changed nested `for (const geoValue of geoValues)` to single-level `for (const [configKey, geoValue] ...)` — direct string assignment instead of char iteration
- **L93-98**: Changed `result.push(...geoValues)` to `result.push(geoValue)` — no spread on string

### 3. `configs.ts`
- **L81-84**: Changed `.flatMap(([key]) => ROOM_CATEGORIES[key as RoomKey] ?? [])` to `.map(([key]) => ROOM_CATEGORIES[key as RoomKey])` — `ROOM_CATEGORIES` values are strings, not arrays. Removed `?? []` fallback since all keys exist in the const object.

### 4. `LabelConfigs.ts`
- **L53-55**: Same fix as configs.ts — changed `.flatMap(... ?? [])` to `.map(...)`

### 5. `categoryNormalizer.ts`
- **Deleted** — dead file with no source code imports

## Verification

- `npx tsc --noEmit` passes (pre-existing errors in `app.config.ts` and `MapContainer.tsx` are unrelated)
- No remaining references to `ROOM_KEYS`, `CATEGORY_NORMALIZE_MAP`, or `normalizeCategory` in source code
