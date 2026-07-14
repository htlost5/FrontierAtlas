---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-13
status: draft
category: log
destination: docs/logs/impl/implementation/2026-07-13_IMP_native-compass.md
tags:
  - IMP
  - compass
  - map-container
  - maplibre
---

# Implementation Log: マップにネイティブ方位磁針（コンパス）追加

## Summary

`@maplibre/maplibre-react-native` v10+ のネイティブコンパスオーナメント機能を有効化。`MapContainer.tsx` の `<MapView>` に `compass` と `compassPosition` prop を追加した。

## Changes

### `mobile/src/features/home/map/components/MapContainer.tsx`

- `compass={true}` — コンパスを有効化
- `compassPosition={{ top: 85, right: 10 }}` — 右上に配置

## 配置判断

既存UIとの重なりを回避:
- SearchBar: 上部中央 (top: 25, height: 50 → 下端 75) → コンパスはさらに下の top: 85 でクリアランス確保
- FloorChange: 左下 (bottom: 65, left: 20) → 競合なし
- UserLocation: 右下 (right: 10, bottom: 70) → 競合なし

- `compassHiddenFacingNorth` はデフォルト `true` のまま（北向き時に自動非表示）

## 関連IF仕様

ユーザ指定タスク（コンパス機能追加）。ARC 成果物なしの単純タスクのため、直接実装。
