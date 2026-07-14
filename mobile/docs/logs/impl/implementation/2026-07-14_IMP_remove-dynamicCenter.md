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

# Implementation Log: Remove dynamicCenter (Zoom-Level Dynamic Bounds)

## Summary

`dynamicCenter` 機能（ズームレベルに応じて動的にカメラ範囲を制限する処理）を完全に削除し、MapLibre 公式の静的 `maxBounds` のみを使用する状態に戻した。

## Changes

### 1. `mapConfig.ts` — restrict.dynamicCenter ブロック削除

- `restrict` 直下の `dynamicCenter`（`enabled`, `animationDuration`, `breakpoints`）をすべて削除
- `bounds` のみを残す

### 2. `MapContainer.tsx` — 動的計算ロジック削除

- `computeMaxBoundsForZoom` の import 行を削除
- `useMemo` import を削除（`React` のみに）
- `useMapContext()` から `zoom` を削除（`colorTheme` のみに）
- `dynamicMaxBounds` useMemo 変数とコメントを削除
- `<Camera>` の `maxBounds={dynamicMaxBounds}` → `maxBounds={mapConfig.restrict.bounds}` に変更

### 3. `MapScreen.tsx` — カメラアクション削除

- `useCameraController` の import 削除
- `boundsBoundary` の import 削除
- `cameraActions` 変数（`useCameraController` 呼び出し）を削除
- `handleRegionIsChanging` 内の `cameraActions(region)` 呼び出しを削除
- `useCallback` の依存配列を `[cameraActions, setZoom]` → `[setZoom]` に簡略化
- 空行を整理

### 4. `useCameraController/boundsBound.ts` — ファイル完全削除

- `boundsBound.ts` をファイルシステムから削除
- `computeMaxBoundsForZoom` / `boundsBoundary` / 補間ロジック / `narrowByToBounds` などを含む全コードが対象
- `index.ts` / `types.ts` は将来の再利用に備えて残す

## Verification

- `get_errors` 対象フォルダ `src/features/home/map/` → **エラーなし**
- 削除された export（`computeMaxBoundsForZoom`, `boundsBoundary`）は他ファイルから参照されていないことを確認済み
- `useCameraController` / `useCameraController/index.ts` は現状未使用になったが、`types.ts` が `MapContainer.tsx` および `types.ts`（再export）から参照されているため維持
