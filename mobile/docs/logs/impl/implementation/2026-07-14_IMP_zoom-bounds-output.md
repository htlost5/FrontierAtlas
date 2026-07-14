---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-14
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-001](../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - IMP
  - implementation
  - TASK-compass-001
---

# Implementation Log: Zoom Level Display with Bounds Output

## Summary

`MapScreen.tsx` の `handleRegionIsChanging` で現在のズームレベルに加え、表示範囲の bounds（ne, sw）も `console.log` に出力するよう変更。あわせて `CameraRegion` 型に `bounds` フィールドを追加。

## Changes

### 1. `src/features/home/map/hooks/camera/useCameraController/types.ts`

`CameraRegion` 型に `bounds` プロパティを追加:

```ts
bounds?: {
  ne: [number, number]; // [lng, lat]
  sw: [number, number]; // [lng, lat]
};
```

### 2. `src/features/home/map/MapScreen.tsx`

`handleRegionIsChanging` 内で bounds を取得し、`console.log` に出力:

```ts
const b = region?.properties?.bounds;
console.log("[zoom]", z, "bounds:", b);
```

## Verification

- `get_errors` で両ファイルとも型エラーなし
- 既存の `setZoom(z)` ロジックは変更なし

## Notes

- `bounds` は `region.properties.bounds`（MapLibre の `visibleBounds` 相当）から取得
- `ne`/`sw` ともに `[lng, lat]` のタプル
