---
agent: IMP
task_id: TASK-map-logic-fixes
date: 2026-07-07
status: draft
category: log
destination: logs/impl/implementation/
related:
  - "[MapIconLabel](../renderers/MapIconLabel.tsx)"
  - "[LabelConfig](../renderers/labels/LabelConfig.ts)"
  - "[LabelConfigs](../renderers/labels/LabelConfigs.ts)"
  - "[shareComp](../renderers/labels/shareComp.tsx)"
  - "[MapSymbolIcon](../renderers/symbols/MapSymbolIcon.tsx)"
tags:
  - IMP
  - refactoring
  - bugfix
  - map
---

# Implementation Log: マップロジック評価に基づく修正 (P1/P2/P3)

## Summary

全60ファイルの評価で発見された問題をP1(CRITICAL)・P2(WARNING)・P3(DRY最適化)の3段階で修正した。

## Changes

### P1-1: `Lavel` → `Label` 命名修正 (3ファイル)

- `renderers/labels/LavelConfig.ts` → `LabelConfig.ts` にリネーム、内部 `LavelConfig` 型 → `LabelConfig`
- `renderers/labels/LavelConfigs.ts` → `LabelConfigs.ts` にリネーム、`LavelKey` → `LabelKey`、`LAVEL_CONFIGS` → `LABEL_CONFIGS`
- `renderers/labels/shareComp.tsx`: `LavelLayer` → `LabelLayer`、import修正
- `renderers/MapIconLabel.tsx`: import/使用箇所を全て新しい名前に更新
- コメント内の`lavelUI/lavelView` 参照は名称変更不要のため維持

### P1-2: `terrace` の lineColor alpha 不正値

- `layers/floor/unit/rooms/configs.ts`: `"rgba(0,0,0,2)"` → `"rgba(0,0,0,0.2)"`

### P1-3: `searchBar.tsx` の `boxShadow` typo

- `components/controls/searchBar.tsx`: `"0px 4x 12px"` → `"0px 4px 12px"`

### P1-4: `PolygonLayer/types.ts` 未使用 `key` prop削除

- `components/mapComp/PolygonLayer/types.ts`: `PolygonProps` から `key?: string` 削除

### P1-5: `loadGeoJson.ts` デバッグコメント除去

- `services/loadGeoJson.ts`: `// -> エラー場所` コメントと `// console.log(text);` を削除

### P2-1: `getGeoDataByLogicalId.ts` — async削除

- `services/getGeoDataByLogicalId.ts`: `async` キーワード削除。`Promise<FeatureCollection>` から `FeatureCollection` に変更
- `hooks/dataLoad/useGeoDataByLogicalId.ts`: `.then()/.catch()` → `try/catch/finally` に書き換え

### P2-2: `useMapEvents.ts` — `e: any` → 適切な型

- `hooks/events/useMapEvents.ts`: `e: any` → `e: { features?: GeoJSON.Feature[] }` に変更

### P2-3: `floor/section/style.ts` — 冗長 `visibility` 削除

- `layers/floor/section/style.ts`: `visibility: "visible"` を fillStyle/lineStyle から削除

### P2-4: `floor/types.ts` — 未使用 `FLOOR_KEYS` 削除

- `layers/floor/types.ts`: `export const FLOOR_KEYS = ["units", "sections"];` 削除

### P2-5: `MapContainer.tsx` — 未使用 `onRegionDidChange` prop削除

- `components/MapContainer.tsx`: Props/引数/MapView から `onRegionDidChange` 削除

### P3-1: symbols 共通パターン抽出

- 新規: `renderers/symbols/MapSymbolIcon.tsx` — アイコン画像登録+SymbolLayer描画の共通コンポーネント
- `renderers/symbols/elevator.tsx` — `iconSizeBase: 0.03` で呼び出し
- `renderers/symbols/toilet.tsx` — male/female/wheelchair の3種を各々呼び出し
- `renderers/symbols/vending.tsx` — `iconSizeBase: 0.06` で呼び出し

### P3-2: `MapIconRegistry.tsx` — 型改善

- `renderers/MapIconRegistry.tsx`: `Record<string, any>` → `Record<string, number>`

## Verification

- `npx tsc --noEmit`: ✅ エラー0
- `npx expo lint`: ✅ エラー0

## Modified Files

| # | File | Change |
|---|------|--------|
| 1 | `mobile/src/features/home/map/renderers/labels/LavelConfig.ts` → `LabelConfig.ts` | Rename + `LavelConfig` → `LabelConfig` |
| 2 | `mobile/src/features/home/map/renderers/labels/LavelConfigs.ts` → `LabelConfigs.ts` | Rename + `LavelKey` → `LabelKey`, `LAVEL_CONFIGS` → `LABEL_CONFIGS` |
| 3 | `mobile/src/features/home/map/renderers/labels/shareComp.tsx` | `LavelLayer` → `LabelLayer`, `LavelConfig` → `LabelConfig` |
| 4 | `mobile/src/features/home/map/renderers/MapIconLabel.tsx` | Import/参照名更新 |
| 5 | `mobile/src/features/home/map/layers/floor/unit/rooms/configs.ts` | alpha値修正 |
| 6 | `mobile/src/features/home/map/components/controls/searchBar.tsx` | `4x` → `4px` |
| 7 | `mobile/src/features/home/map/components/mapComp/PolygonLayer/types.ts` | `key?` 削除 |
| 8 | `mobile/src/features/home/map/services/loadGeoJson.ts` | デバッグコメント除去 |
| 9 | `mobile/src/features/home/map/services/getGeoDataByLogicalId.ts` | `async` 削除 |
| 10 | `mobile/src/features/home/map/hooks/dataLoad/useGeoDataByLogicalId.ts` | `.then()` → `try/catch` |
| 11 | `mobile/src/features/home/map/hooks/events/useMapEvents.ts` | `e: any` → 型付け |
| 12 | `mobile/src/features/home/map/layers/floor/section/style.ts` | `visibility` 削除 |
| 13 | `mobile/src/features/home/map/layers/floor/types.ts` | `FLOOR_KEYS` 削除 |
| 14 | `mobile/src/features/home/map/components/MapContainer.tsx` | `onRegionDidChange` 削除 |
| 15 | `mobile/src/features/home/map/renderers/symbols/MapSymbolIcon.tsx` | 新規作成 |
| 16 | `mobile/src/features/home/map/renderers/symbols/elevator.tsx` | `MapSymbolIcon` 使用に書き換え |
| 17 | `mobile/src/features/home/map/renderers/symbols/toilet.tsx` | `MapSymbolIcon` 使用に書き換え |
| 18 | `mobile/src/features/home/map/renderers/symbols/vending.tsx` | `MapSymbolIcon` 使用に書き換え |
| 19 | `mobile/src/features/home/map/renderers/MapIconRegistry.tsx` | `Record<string, any>` → `Record<string, number>` |
