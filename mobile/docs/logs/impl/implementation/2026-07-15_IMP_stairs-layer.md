---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-15
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[DD-stairs-filter]"
tags:
  - IMP
  - implementation
  - stairs
  - TASK-compass-001
---

# Implementation Log: Stairs Layer

## Summary

stairs.geojson を階層別に描画する StairsLayer コンポーネントを実装した。

## Changed Files

| File | Change |
|------|--------|
| `src/features/home/map/layers/stairs/filter.ts` | **新規** — `buildStairsFilter()`: currentFloor に応じて category="4-5" を除外する動的フィルタ |
| `src/features/home/map/layers/stairs/index.tsx` | **新規** — `StairsLayer` コンポーネント: ShapeSource + LineLayer、useMemo フィルタ、OPACITY_TRANSITION 対応 |
| `src/features/home/map/constants/colorPalette.ts` | `StairsPalette` 型追加、`ColorTheme.stairs` プロパティ追加、LIGHT/DARK 値追加 |
| `src/features/home/map/MapScreen.tsx` | `StairsLayer` import 追加、FloorView 直下にレンダリング追加 |

## Implementation Details

### filter.ts
- 1F-3F: category="4-5" の Feature を除外
- 4F-5F: 全 Feature 表示（`["literal", true]`）

### StairsLayer (index.tsx)
- `@maplibre/maplibre-react-native` の ShapeSource + LineLayer
- Props: `{ data, currentFloor, palette, visible? }`
- `useMemo` で動的フィルタをメモ化
- `visible={false}` 時は `lineOpacity: 0`（200ms transition）

### colorPalette.ts
- `StairsPalette` 型: `lineColor`, `lineWidth`, `lineOpacity`
- LIGHT: `#A09080`, 2.5, 0.8
- DARK: `#8B7D6B`, 2.5, 0.8

### MapScreen.tsx
- FloorView の直後、UnitSymbol の直前に挿入
- `displayMode !== "building"` で visible 制御

## Validation
- ✅ 全変更ファイルで型エラーなし（VSCode get_errors 確認済）
- ✅ 既存コードの変更なし（最小差分）
- ✅ export 漏れなし

## Handoff to REV

```
status: 成功
confidence: high
artifacts:
  - src/features/home/map/layers/stairs/filter.ts        (新規)
  - src/features/home/map/layers/stairs/index.tsx         (新規)
  - src/features/home/map/constants/colorPalette.ts       (変更)
  - src/features/home/map/MapScreen.tsx                   (変更)
open_questions: なし
next_actions: REV によるコードレビュー
```
