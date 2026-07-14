---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-14
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-001](../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - IMP
  - implementation
  - narrowBy
  - TASK-compass-001
---

# Implementation Log: boundsBreakpoints の narrowBy 方式への変更

## Summary

DEV の設計決定（DD-compass-002）に基づき、`inset` 方式から `narrowBy` 方式に変更した。

## Changes

### 1. `mobile/src/features/home/map/constants/mapConfig.ts`

- `breakpoints` のプロパティ名を `inset` → `narrowBy` に変更（2箇所）

### 2. `mobile/src/features/home/map/hooks/camera/useCameraController/boundsBound.ts`

- `insetToBounds` 関数を `narrowByToBounds` に全面書き換え
  - 旧: maxBounds の中心から外側に inset 分拡大
  - 新: maxBounds の各端点（NE/SW）を LOCAL_XY に変換し、各辺から narrowBy 分内側に狭める
  - narrowBy が bounds の半分を超えた場合の console.warn + クランプ処理を追加
- 補間ロジックを変更
  - 旧: 補間後の bounds 座標を lerp していた
  - 新: `narrowBy` 値自体を lerp 補間し、その結果で 1 回だけ `narrowByToBounds` を呼ぶ
- エッジケース対応
  - `breakpoints.length < 2` で早期 return → `breakpoints.length === 0` に変更
  - ブレークポイントが 1 つだけの場合 → その値を全ズーム範囲で適用

## TypeScript 確認

`get_errors` でエラーなし確認済み。

## Handoff

status: success
confidence: high
artifacts:
  - modified: mobile/src/features/home/map/constants/mapConfig.ts
  - modified: mobile/src/features/home/map/hooks/camera/useCameraController/boundsBound.ts
  - created: docs/logs/impl/implementation/2026-07-14_IMP_bounds-narrowBy.md
open_questions: (none)
next_actions: REV へレビュー依頼
