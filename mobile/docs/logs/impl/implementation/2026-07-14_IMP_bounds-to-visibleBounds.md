---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-14
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-001](../../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - IMP
  - implementation
  - TASK-compass-001
---

# Implementation Log: bounds → visibleBounds 修正

## 概要

REV のレビュー指摘に基づき、`CameraRegion` 型の `bounds` プロパティを `visibleBounds`（タプル形式）に修正。

## 変更内容

### 1. `src/features/home/map/hooks/camera/useCameraController/types.ts`

- `bounds?: { ne: [number, number]; sw: [number, number] }` を削除
- `visibleBounds?: [[number, number], [number, number]]` に置き換え（`// [northEast, southWest]`）

### 2. `src/features/home/map/MapScreen.tsx` (handleRegionIsChanging)

- `region?.properties?.bounds` → `region?.properties?.visibleBounds`
- コンソール出力を可読性向上: `console.log("[zoom]", z, "bounds:", b)` → ne/sw を分割して `{ ne, sw }` オブジェクトとして出力

## 確認

- `types.ts`: 型エラーなし ✅
- `MapScreen.tsx`: 型エラーなし ✅
