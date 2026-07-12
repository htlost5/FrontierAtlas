---
agent: IMP
task_id: TASK-map-layer-order-and-grayscale
date: 2026-07-12
status: draft
category: log
destination: logs/impl/implementation/
related:
  - "[MapScreen](../shared/impl/specs/map-layer-order.md)"
tags:
  - IMP
  - map
  - layer-order
  - grayscale
---

# Implementation Log: マップレイヤー順序調整とグレーアウト実装

## 変更内容

### 新規ファイル
- `renderers/processUnitData.ts` — `processUnitData()` / `useProcessedUnitData()` 共通ユーティリティ
  - `MapIconLabel` と `UnitSymbol` で同一の表示ポイント加工ロジックを共有するために抽出

### 変更ファイル一覧

| ファイル | 変更内容 |
|----------|----------|
| `MapScreen.tsx` | `useMemo` 追加、`UnitSymbol` 分離・最背面配置、`FloorView` に `visible` 注入、`MapIconLabel` から UnitSymbol 除去 |
| `MapIconLabel.tsx` | `UnitSymbol` インポート削除、`processedGeoJson` ロジックを `useProcessedUnitData` に置換 |
| `layers/floor/types.ts` | `FloorProps` に `visible?: boolean` 追加 |
| `layers/floor/index.tsx` | `visible` prop 受取 → SectionView / UnitView に転送 |
| `layers/floor/section/index.tsx` | `visible` prop 受取 → `PolygonLayer` に転送 |
| `layers/floor/unit/index.tsx` | `visible` prop 受取 → BaseView / RoomView に転送 |
| `layers/floor/unit/bases/index.tsx` | `visible` prop 受取 → `PolygonLayer` に転送 |

### レイヤー順序（下→上 / MapLibre 描画順）

```
特殊シンボル（UnitSymbol）      — isVisible: detail ? 1 : 0
  ↓
FloorView（ポリゴン + セクション） — visible: building ? false : true
  ↓
MapIconLabel（ラベルのみ）       — isVisible: detail ? true : false
  ↓
BuildingsView                   — visible: building ? true : false
```

### 表示モード別動作

| モード | zoom | UnitSymbol | FloorView | ラベル | BuildingsView |
|--------|------|-----------|-----------|--------|---------------|
| building | < 18.0 | 非表示 | opacity 0 (200ms) | 非表示 | 表示 |
| entrance | 18.0–19.4 | 非表示 | 表示 | 非表示 | 非表示 |
| detail | ≥ 19.5 | 表示 | 表示 | 表示 | 非表示 |

## 検証結果
- TypeScript エラー: 全ファイル 0
- PolygonLayer の `visible=false` → `fillOpacity: 0` + `lineOpacity: 0` + 200ms transition は既存実装のため変更不要
- `RoomView` は既に `visible` prop 対応済みのため変更不要
