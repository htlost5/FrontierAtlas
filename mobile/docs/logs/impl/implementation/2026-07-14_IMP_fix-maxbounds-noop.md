---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-14
status: approved
category: log
destination: docs/logs/impl/implementation/
tags:
  - IMP
  - implementation
  - TASK-compass-001
---

# Implementation Log: Fix computeMaxBoundsForZoom No-Op Bug

## Problem

`computeMaxBoundsForZoom` の `halfViewport` デフォルト値が `narrowBy` と同じ値だったため、常に `restrict.bounds` と同一の maxBounds が返り、実質ノーオペレーションになっていた。

```
maxBounds = narrowedBounds + halfViewport
          = (restrict.bounds - narrowBy) + narrowBy
          = restrict.bounds   ← 常に静的 bounds と同一
```

## Fix

### 1. `mapConfig.ts` — breakpoints の narrowBy 値修正

zoom 20.3 の narrowBy を 24.7 → 105 に変更（= halfViewport 24.7 + extraConstraint 80m）。

### 2. `boundsBound.ts` — halfViewport の独立補間

- `halfViewportBreakpoints` を新設（既存 narrowBy 値をそのまま転用）
- `interpolateHalfViewport()` 関数を追加
- `computeMaxBoundsForZoom` の `halfViewportMeters?` パラメータを削除し、内部で `interpolateHalfViewport(zoom)` を呼ぶよう変更

### 修正後の数式

```
maxBounds = narrowByToBounds(narrowBy) + halfViewport
          = (restrict.bounds - narrowBy) + halfViewport
          ≠ restrict.bounds  (narrowBy ≠ halfViewport)
```

## Files Changed

| File | Change |
|------|--------|
| `src/features/home/map/constants/mapConfig.ts` | breakpoints[1].narrowBy: 24.7 → 105 |
| `src/features/home/map/hooks/camera/useCameraController/boundsBound.ts` | `interpolateHalfViewport` 追加、`computeMaxBoundsForZoom` シグネチャ変更・ロジック修正 |

## Verification

- `get_errors` で boundsBound.ts / mapConfig.ts / MapContainer.tsx のエラーなし
- `computeMaxBoundsForZoom` の呼び出し元 (`MapContainer.tsx` line 33) はパラメータ無しで呼び出しているため、シグネチャ変更の影響なし

## Expected Behavior

| Zoom | narrowBy | halfViewport | maxBounds = restrict.bounds - narrowBy + halfViewport |
|------|----------|--------------|--------------------------------------------------------|
| 17.35 | 190.1 | 190.1 | restrict.bounds（自然制約のみ） |
| 18.5 | ~156.9 | ~125.6 | restrict.bounds - 31.3m（31m tight） |
| 20.3 | 105 | 24.7 | restrict.bounds - 80m（80m tight） |
