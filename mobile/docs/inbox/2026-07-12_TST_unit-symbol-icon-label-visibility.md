---
agent: TST
task_id: TASK-unit-symbol-icon-label-visibility
date: 2026-07-12
status: pending
category: shared
destination: logs/impl/testing/
tags:
  - TST
  - testing
  - visibility
  - UnitSymbol
  - MapIconLabel
---

# Testing Log: UnitSymbol / MapIconLabel 可視性条件変更の検証

## テスト対象

- `src/features/home/map/MapScreen.tsx`（lines 128-150）
- `src/features/home/map/hooks/state/useDisplayLevel.ts`

## 変更点の確認

### 変更前
| コンポーネント | 条件 |
|---|---|
| `UnitSymbol isVisible` | `displayMode === "detail" ? 1 : 0` |
| `MapIconLabel isVisible` | `displayMode === "detail"` |

### 変更後（コード確認時点の実装）
| コンポーネント | 条件 |
|---|---|
| `UnitSymbol isVisible` | `displayMode !== "building" ? 1 : 0` |
| `MapIconLabel isVisible` | `displayMode !== "building"` |

### 閾値（`mapConfig.displayThresholds`）
- `building`: 18.0
- `entrance`: 19.5

## テスト結果

### 観点1: building モード（zoom < 18.0）✅
- `useDisplayLevel` の戻り値 → `"building"`
- **UnitSymbol**: `displayMode !== "building"` → `false` → `0` → `visible = "none"` → **非表示**
- **MapIconLabel**: `displayMode !== "building"` → `false` → 早期リターン → **非表示**
- **結果: 正常**

### 観点2: entrance モード（18.0 ≤ zoom < 19.5）✅
- `useDisplayLevel` の戻り値 → `"entrance"`
- **UnitSymbol**: `displayMode !== "building"` → `true` → `1` → `visible = "visible"` → **表示**
- **MapIconLabel**: `displayMode !== "building"` → `true` → レンダリング通過 → **表示**
- **結果: 正常**

### 観点3: detail モード（zoom ≥ 19.5）✅
- `useDisplayLevel` の戻り値 → `"detail"`
- **UnitSymbol**: `displayMode !== "building"` → `true` → `1` → `visible = "visible"` → **表示**
- **MapIconLabel**: `displayMode !== "building"` → `true` → レンダリング通過 → **表示**
- **結果: 正常**

### 観点4: FloorView との同時表示切替 — チラつきなし ✅
FloorView の visible 条件も `displayMode !== "building"`（`index.tsx` line 10）であり、3コンポーネント全てが**同一の条件式**を使用:
- `FloorView visible`: `displayMode !== "building"`
- `UnitSymbol isVisible`: `displayMode !== "building" ? 1 : 0`（意味的に同一）
- `MapIconLabel isVisible`: `displayMode !== "building"`（意味的に同一）

→ 全コンポーネントが同一閾値・同一条件で同時に表示/非表示を切り替えるため、**チラつきの原因となる表示タイミング差は発生しない**。

### 観点5: TypeScript 型安全性 ✅
- コマンド: `npx tsc --noEmit --pretty`
- 結果: **エラーなし**（出力なし = 正常）
- `UnitSymbol isVisible` の Props 型: `number` — `displayMode !== "building" ? 1 : 0` → `number` 🆗
- `MapIconLabel isVisible` の Props 型: `boolean` — `displayMode !== "building"` → `boolean` 🆗

## 総合判定: ✅ 合格

| 観点 | 結果 |
|---|---|
| 1. building モードで両方非表示 | ✅ |
| 2. entrance モードで両方表示 | ✅ |
| 3. detail モードで両方表示 | ✅ |
| 4. FloorView と同一条件・チラつきなし | ✅ |
| 5. TypeScript 型安全性 | ✅ |
