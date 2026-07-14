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
