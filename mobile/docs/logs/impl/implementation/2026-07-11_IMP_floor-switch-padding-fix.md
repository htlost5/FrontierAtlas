---
agent: IMP
task_id: TASK-floor-switch-padding-fix
date: 2026-07-11
status: draft
category: log
destination: logs/impl/implementation/
tags:
  - IMP
  - bugfix
  - maplibre
  - padding
  - opentobelow
---

# CameraPadding 型修正 & opentobelow 二重描画修正

## 修正内容

### 修正1: CameraPadding 型エラー (MapRoot.tsx)

MapLibre `setCamera()` の `CameraPadding` が期待する `{ paddingLeft, paddingRight, paddingTop, paddingBottom }` 形式に修正。

**変更ファイル**: `src/features/home/map/MapRoot.tsx`

- `moveTo` 関数内: `padding` プロパティを `{ padding: { paddingTop: padding.top, paddingBottom: padding.bottom, paddingLeft: padding.left, paddingRight: padding.right } }` に変換
- `flyToSearchResult` 関数内: 直接指定の `padding` を `{ paddingTop: 100, paddingBottom: 220, paddingLeft: 60, paddingRight: 20 }` に修正

### 修正2: opentobelow 二重描画 (configs.ts)

**変更ファイル**: `src/features/home/map/layers/floor/unit/rooms/configs.ts`

- `ROOM_ZONE_MAP` から `opentobelow: "other"` を削除（吹抜けは構造体であり rooms ゾーンに属すべきではない）
- `buildZoneFilter` の `zone === "other"` 特別分岐を削除（不要になったため簡略化）

## 確認

- TypeScript エラー: 0件（両ファイルとも）
- `bases/filters.ts` の `atrium: "open_to_below"` は独立して存在し、Bases レイヤーで正しく描画されることを確認済み
