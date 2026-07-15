---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-15
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[LabelConfigs.ts](../../../src/features/home/map/renderers/labels/LabelConfigs.ts)"
tags:
  - IMP
  - implementation
  - label-override
---

# Implementation Log: Label Override Aggregation Logic Fix

## Summary

`buildLabelOverrides()` の集約ロジックを修正。未マッピングの GeoJSON サブカテゴリがデフォルト `true` になることで RoomCategory 全体のラベル表示が誤って有効になる問題を修正した。

## Changes

### File: `mobile/src/features/home/map/renderers/labels/LabelConfigs.ts`

1. **import 追加**: `getCategoryConfig` を `categoryDisplayConfig` から追加 import
2. **`buildLabelOverrides()` のロジックを以下の通り修正**:
   - **フォールバック**: `sanitary` / `circulation` に `{iconVisible:false, textVisible:false}` を初期値として設定
   - **フィルタリング**: `geoValues` のうち `getCategoryConfig(v) !== undefined` のものだけを `configuredValues` として抽出（未マッピングカテゴリを除外）
   - **スキップ条件**: `configuredValues.length === 0` の場合はフォールバックを維持（上書きしない）
   - **ANY 基準**: `configuredValues.some(v => isLabelIconVisible(v))` で `iconVisible` を決定。text も同様
3. **JSDoc 更新**: 新しいロジックを反映

### 修正前の動作（問題）
- 全 `geoValues`（未マッピング含む）を `every()` で評価
- 未マッピングは `isLabelIconVisible()` のデフォルト `true` になる
- 例: `circulation` の未マッピングサブカテゴリ（entrance, terrace, warehouse 等）がすべて `true` → `allIconHidden=false` → オーバーライドなし → デフォルト `iconVisible: true` が適用

### 修正後の動作
- `configuredValues` のみ評価
- 未マッピングは完全に無視
- 設定済みサブカテゴリがゼロ → フォールバック維持（sanitary/circulation は false）
- ANY 基準により、1 つでも `true` があればグループ全体が表示

## Verification

- TypeScript コンパイルエラーなし（変更ファイルに関して）
- 既存のエラー（`app.config.ts`, `MapContainer.tsx`）は変更前から存在
