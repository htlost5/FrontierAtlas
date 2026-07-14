---
agent: IMP
task_id: TASK-dynamicCenter-001
date: 2026-07-14
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[boundsBound.ts](../../../../src/features/home/map/hooks/camera/useCameraController/boundsBound.ts)"
  - "[MapContainer.tsx](../../../../src/features/home/map/components/MapContainer.tsx)"
  - "[mapConfig.ts](../../../../src/features/home/map/constants/mapConfig.ts)"
tags:
  - IMP
  - implementation
  - TASK-dynamicCenter-001
  - fix
---

# Implementation Log: Fix dynamicCenter (boundsBound) Not Working

## Problem

`dynamicCenter` (`boundsBoundary`) が動作していない。`maxBounds`（MapLibre ネイティブ）のみが制約として効いており、`camera.setCamera()` による中心クランプが効いていない。

### 原因の仮説

MapLibre はユーザのアクティブなジェスチャー（パン/ピンチ）中に `camera.setCamera()` を無視する可能性が高い。このため `onRegionIsChanging` から呼ばれる `boundsBoundary` のクランプが機能していなかった。

## Changes

### 1. 診断ログ追加（`boundsBound.ts`）

`console.log("[boundsBound]", ...)` を以下の各ポイントに追加：
- zoomLevel が取得できない場合の SKIP
- center が欠けている場合の SKIP
- breakpoints が空の場合の SKIP
- 各呼び出しでの zoom/center/narrowBy/dynamicBounds の値ログ
- 中心が bounds 内の場合の "OK" ログ
- クランプ発動時の CLAMPING ログ（old center → new center）

### 2. `computeMaxBoundsForZoom` 関数（`boundsBound.ts`）

新規エクスポート関数。ズームレベルを受け取り、以下を行う：
1. `interpolateNarrowBy(z)` で breakpoints から補間し narrowBy を計算
2. `narrowByToBounds(narrowBy)` で narrowed bounds を計算
3. narrowed bounds を halfViewport 分拡張して maxBounds を計算
4. 結果を `{ ne: [lng, lat], sw: [lng, lat] }` で返す

`halfViewport` パラメータで可視範囲半幅を上書き可能（デフォルトは narrowBy 値）。

### 3. 動的 `maxBounds` 適用（`MapContainer.tsx`）

- `useMapContext()` から `zoom` を取得
- `useMemo(() => computeMaxBoundsForZoom(zoom), [zoom])` で動的 maxBounds を計算
- `<Camera maxBounds={dynamicMaxBounds}>` に渡す
- 元の `maxBounds={mapConfig.restrict.bounds}` から変更

### 4. 元の `boundsBoundary` 維持（`mapConfig.ts` / `MapScreen.tsx`）

既存の `boundsBoundary` CameraAction は維持（二重の安全策）。

## How It Works

```
ユーザパン/ピンチ
  → MapLibre ネイティブ maxBounds（動的）
    → 中心が narrowed bounds + halfViewport 範囲外に出ないよう強制
  → onRegionIsChanging → boundsBoundary（二重安全策、camera.setCamera）
```

`maxBounds` は MapLibre がネイティブに制約を強制するため、ユーザのアクティブなジェスチャー中でも有効。

## Affected Files

| File | Change |
|------|--------|
| `boundsBound.ts` | 診断ログ追加 + `computeMaxBoundsForZoom` 関数追加 + `interpolateNarrowBy` ユーティリティ関数追加 |
| `MapContainer.tsx` | 動的 `maxBounds` 適用、`useMapContext` から `zoom` 取得、`computeMaxBoundsForZoom` import |

## Verification

- TypeScript エラー: ✅ なし（`get_errors` で確認済）
- boundsBound.ts と MapContainer.tsx の両方でエラーなし
