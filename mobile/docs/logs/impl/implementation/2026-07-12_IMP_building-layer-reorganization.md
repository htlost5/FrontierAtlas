---
agent: IMP
task_id: TASK-unassigned
date: 2026-07-12
status: draft
category: log
destination: logs/impl/implementation/
tags:
  - IMP
  - building-layer
  - floor-color
  - layer-order
---

# 実装ログ: 建物レイヤー修正 — 床色ビルディングレイヤーの追加とレイヤー順再編成

## 変更内容

### 1. `colorPalette.ts` — `buildingFloor` カラーの追加
- `ColorTheme` 型に `buildingFloor: RoomCategoryPalette` を追加
- `LIGHT_THEME`: `{ fill: "#EDE8DC", line: "#D5CFC0", opacity: 0.9 }`
- `DARK_THEME`: `{ fill: "#2A2620", line: "#3D3830", opacity: 0.9 }`

### 2. `buildings/style.ts` — 床色用スタイル関数の追加
- `getBuildingFloorFillStyle()` — `colorTheme.buildingFloor` を使用
- `getBuildingFloorLineStyle()` — 線幅 1px（通常の建物より細く）
- 既存の `getBuildingsFillStyle` / `getBuildingsLineStyle` はそのまま維持

### 3. `buildings/index.tsx` — variant prop 対応
- Props に `variant?: 'dim' | 'floor'` を追加（デフォルト `'dim'`）
- `variant === 'floor'` 時は `getBuildingFloorFillStyle` / `getBuildingFloorLineStyle` 使用
- prefixId も `building_floor_${key}` に変更

### 4. `MapScreen.tsx` — レイヤー順再編成
目標のレイヤー順（JSX描画順＝後ほど上に描画）:
1. Venue（最背面）← 移動
2. **BuildingsView (variant="floor")** ← 新規追加（visible: `displayMode !== "building"`）
3. FloorView（section → unit 含む）
4. UnitSymbol
5. MapIconLabel
6. BuildingsView (variant="dim") ← 最前面維持（visible: `showBuildings`）

## 確認事項
- 全ファイル TypeScript エラーなし
- `buildingFloor` の fill/line は `RoomCategoryPalette` 型に準拠
- `FloorView` 内部の floorSurface PolygonLayer は変更なし（Building データとは別物）
