---
agent: IMP
task_id: TASK-map-design-revamp
date: 2026-07-11
status: completed
category: log
destination: logs/impl/implementation/
related:
  - "[configs.ts](../../../../mobile/src/features/home/map/layers/floor/unit/rooms/configs.ts)"
  - "[userLocation.tsx](../../../../mobile/src/features/home/map/components/controls/userLocation.tsx)"
tags:
  - IMP
  - REV差し戻し
  - opentobelow
  - テーマ対応
---

# Implementation Log — REV 条件付き承認の修正

## 修正内容

### 修正1: `opentobelow` の二重描画修正

**ファイル**: `mobile/src/features/home/map/layers/floor/unit/rooms/configs.ts`

- `buildZoneFilter()` の `"other"` ゾーン分岐で `opentobelow` を除外する `["!=", ...]` 条件を追加
- atrium 専用の `BaseView` が `opentobelow` を担当する設計に整合

### 修正2: `userLocation.tsx` のテーマ対応

**ファイル**: `mobile/src/features/home/map/components/controls/userLocation.tsx`

- `useMapContext()` から `colorTheme` を取得
- `TouchableOpacity` に `backgroundColor: colorTheme?.controls.floorBg ?? "#FFFFFF"` を適用
- アイコン色（`#007AFF`）はテーマ非依存のまま維持

## 確認

- TypeScript エラー: 0件（両ファイルとも）

## ハンドオフ

次の工程: TST（テスト実行）
