---
agent: TST
task_id: TASK-unit-symbol-layer-order
date: 2026-07-12
status: pending
category: shared
destination: logs/impl/testing/
tags:
  - TST
  - testing
  - layer-order
  - UnitSymbol
  - FloorView
  - MapScreen
---

# Testing Log: UnitSymbol レイヤー順序修正の検証

## テスト対象
`src/features/home/map/MapScreen.tsx`

## 変更内容
UnitSymbol と FloorView の JSX レンダリング順序を入れ替え。
- **変更前**: VenueView → UnitSymbol → FloorView → MapIconLabel → BuildingsView
- **変更後**: VenueView → FloorView → UnitSymbol → MapIconLabel → BuildingsView

## テスト観点と結果

### 観点1: JSX 順序確認 ✅
コード確認時点のレンダリング順序（lines 118-161）:

| # | コンポーネント | 行 | 条件 |
|---|---------------|----|------|
| 1 | `VenueView` | 123 | `batchData.venue` |
| 2 | `FloorView` | 129-133 | `batchData.floorData` |
| 3 | `UnitSymbol` | 138-140 | `batchData.floorData` |
| 4 | `MapIconLabel` | 146-150 | `batchData.floorData` |
| 5 | `BuildingsView` | 155-159 | `batchData.buildings` |

→ **要求の順序に一致**: `VenueView → FloorView → UnitSymbol → MapIconLabel → BuildingsView` ✅

### 観点2: 要求との一致（MapLibre 下→上） ✅
ユーザ要求「グレーアウト > 通常シンボル > 特殊シンボル > 地物描画」を MapLibre の描画順（JSX 下から上 = 画面下から上）に変換:

| MapLibre 描画順 | コンポーネント | 分類 |
|-----------------|---------------|------|
| 1 (最下層) | FloorView | 地物描画（FillLayer） |
| 2 | UnitSymbol | 特殊シンボル（トイレ・EV・階段） |
| 3 | MapIconLabel | 通常シンボル（ラベル） |
| 4 (最上層) | BuildingsView | グレーアウト |
