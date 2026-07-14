---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-14
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[mapConfig.ts](../../../../src/features/home/map/constants/mapConfig.ts)"
  - "[coordinateTransform.ts](../../../../src/utils/coordinateTransform.ts)"
tags:
  - IMP
  - implementation
  - TASK-compass-001
---

# Implementation Log: Restrict Bounds Recalculation

## Task

`mapConfig.ts` の `restrict.bounds` と `dynamicCenter.breakpoints` の数値を、実測ログデータに基づいて再計算・更新する。

## Method

`coordinateTransform.ts` の `toLocalXY()` / `distanceMeters()` 関数を使用し、AEQDローカル直交座標系で距離計算を行った。

### LOG データ（4エントリ）

| Zoom | NE lng | NE lat | SW lng | SW lat |
|------|--------|--------|--------|--------|
| 17.35 | 139.68010757 | 35.49889240 | 139.67823778 | 35.49582529 |
| 17.35 | 139.67926982 | 35.49975630 | 139.67740003 | 35.49668923 |
| 20.3  | 139.67947531 | 35.49679905 | 139.67923471 | 35.49640267 |
| 20.3  | 139.67798001 | 35.49919763 | 139.67773470 | 35.49879944 |

### Step 1: Union Bounds

- **Union NE**: lng=**139.68010757** (max of 4 entries), lat=**35.49975630**
- **Union SW**: lng=**139.67740003** (min of 4 entries), lat=**35.49582529**
- Buffer: ~1m (lng=0.000011°, lat=0.000009°)
- **Final NE**: `[139.680119, 35.499765]`
- **Final SW**: `[139.677389, 35.495816]`

中心→各辺: ~251.6m（ほぼ正方形）

### Step 2: narrowBy Calculation

各 zoom の各エントリについて、bounds の中心→NEコーナーの距離（halfWidth）を計算：

| Zoom | Entry | Center (lng, lat) | halfWidth | max |
|------|-------|--------------------|-----------|-----|
| 17.35 | #1 | 139.67917267, 35.49735885 | **190.12m** | **190.1** |
| 17.35 | #2 | 139.67833493, 35.49822277 | **190.12m** | |
| 20.3  | #1 | 139.67935501, 35.49660086 | 24.55m | **24.7** |
| 20.3  | #2 | 139.67785735, 35.49899854 | **24.73m** | |

### Step 3: Result

```typescript
restrict: {
  bounds: {
    ne: [139.680119, 35.499765],
    sw: [139.677389, 35.495816],
  },
  dynamicCenter: {
    enabled: true,
    animationDuration: 0,
    breakpoints: [
      { zoom: 17.35, narrowBy: 190.1 },
      { zoom: 20.3,  narrowBy: 24.7 },
    ],
  },
},
```

## Verification

- `restrict.bounds` の中心から各辺までの距離: 全て約251.6m → 対称な形状
- エラーなし（`get_errors` 確認済）
