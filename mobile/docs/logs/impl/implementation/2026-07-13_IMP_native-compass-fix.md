---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-13
status: pending
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-001](../../shared/tasks/active/TASK-compass-001_compass-feature.md)"
  - "[TST Log](../../logs/impl/testing/2026-07-13_TST_native-compass.md)"
tags:
  - IMP
  - implementation
  - bugfix
  - TASK-compass-001
---

# Implementation Log: Compass API 型エラー修正

## 背景

前回の実装で `compass={true}` / `compassPosition={{ top: 85, right: 10 }}` を使用したが、
TST が `npx tsc --noEmit` で以下の型エラーを検出:

```
Property 'compass' does not exist on type 'MapViewProps'.
```

## 原因

`@maplibre/maplibre-react-native` v10.4.2 の `MapViewProps` 型定義において、
コンパス関連のプロパティ名が誤っていた。

## 修正内容

| 誤った実装 | 正しい API |
|---|---|
| `compass={true}` | `compassEnabled={true}` |
| `compassPosition={{ top: 85, right: 10 }}` | `compassViewPosition={1}` + `compassViewMargins={{ x: 10, y: 85 }}` |

- `compassViewPosition={1}`: TopRight (0: TopLeft, 1: TopRight, 2: BottomLeft, 3: BottomRight)
- `compassViewMargins={{ x: 10, y: 85 }}`: 右端から10px、上端から85px

## 変更ファイル

- `mobile/src/features/home/map/components/MapContainer.tsx` — 2行修正

## 検証

- `npx tsc --noEmit` → ✅ エラー0
