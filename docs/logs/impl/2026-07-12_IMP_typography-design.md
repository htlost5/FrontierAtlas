---
agent: IMP
task_id: Unified Typography Design
date: 2026-07-12
status: draft
category: log
destination: logs/impl/implementation/
related:
  - "[typography.ts](../../src/shared/constants/typography.ts)"
  - "[mapStyle.ts](../../../mobile/src/features/home/map/constants/mapStyle.ts)"
tags:
  - IMP
  - typography
  - font
  - mapStyle
---

# Implementation Log: Unified Typography Design

## Summary

Created a single source of truth (`typography.ts`) for all font configuration in the app and migrated all font references across 12 files.

## Changes Made

### Created

- **`mobile/src/shared/constants/typography.ts`** — Single source of truth for:
  - `APP_FONTS` — React Native `<Text>` font family names
  - `FONT_STACK` — MapLibre SymbolLayer glyph server font stacks
  - `FONT_SIZE` — Unified typography scale

### Modified

| File | Change |
|------|--------|
| `mapStyle.ts` | Removed local `FONT_STACK`, import & re-export from `typography.ts` |
| `shareComp.tsx` | Import `FONT_STACK` from `@/src/shared/constants/typography` |
| `useLoadFonts.ts` | Use `[APP_FONTS.lunaChord]` computed key instead of hardcoded `"Y1LunaChord"` |
| `classroom/index.tsx` | `"Y1LunaChord"` → `APP_FONTS.lunaChord`, `fontSize: 20` → `FONT_SIZE.heading` |
| `calendar/index.tsx` | Same as above |
| `tools/index.tsx` | Same as above |
| `FloorChange.tsx` | `fontSize: 14` → `FONT_SIZE.floorControl` |
| `FullScreenLoading.tsx` | `fontSize: 16` → `FONT_SIZE.body` |
| `ErrorOverlay.tsx` | `fontSize: 48` → `FONT_SIZE.errorIcon`, `fontSize: 16` → `FONT_SIZE.body` (×2) |
| `searchBar.tsx` | `fontSize: 22` → `FONT_SIZE.searchBar` |
| `home/search.tsx` | `fontSize: 22` → `FONT_SIZE.searchBar`, `fontSize: 18` → `FONT_SIZE.bodyLarge` |
| `TabItem.tsx` | `fontSize: 10` → `FONT_SIZE.tab` |

### Type Fix

- `FONT_STACK` in `typography.ts`: Changed from `as const` to explicit `{ readonly DEFAULT: string[]; ... }` type to maintain MapLibre `textFont` compatibility without casts.

## Verification

- ✅ All TypeScript errors resolved (0 errors across workspace)
- ✅ All font references now use centralized constants
- ✅ Two font domains (React Native vs MapLibre) are cleanly separated
- ✅ No breaking changes to runtime behavior

## Open Questions

None.

## Handoff to REV

All edits are complete and verified. See files listed above for review.
