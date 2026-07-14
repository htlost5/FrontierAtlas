---
agent: IMP
task_id: TASK-unit-symbol-layer-order
date: 2026-07-12
status: pending
category: log
destination: logs/impl/implementation/
tags:
  - IMP
  - implementation
  - MapScreen
  - UnitSymbol
  - FloorView
  - layer-order
---

# Implementation Log: UnitSymbol レイヤー順序修正

## 概要

UnitSymbol（特殊シンボル）が FloorView ポリゴンの下に描画され、不透明な FillLayer に覆われて表示されない問題を修正。

## 変更内容

### ファイル

`src/features/home/map/MapScreen.tsx`

### 変更前のレイヤー順序

```
VenueView → UnitSymbol → FloorView → MapIconLabel → BuildingsView
```

### 変更後のレイヤー順序

```
VenueView → FloorView → UnitSymbol → MapIconLabel → BuildingsView
```

### 具体的な操作

- `UnitSymbol` ブロック（特殊シンボル）と `FloorView` ブロック（Floor レイヤー）の JSX 内の順序を入れ替え
- コメントを新しい順序に合わせて更新（「最背面」→「地物描画の上」）
- 可視性ロジック（`isVisible`/`visible`）は一切変更なし

## 確認結果

| 項目 | 結果 |
|------|------|
| TypeScript コンパイル | ✅ エラーなし（`npx tsc --noEmit --pretty`） |
| 可視性ロジック不変 | ✅ すべて元の式を維持 |
| コメント整合性 | ✅ 新しい順序に合わせて更新済み |

## 引き継ぎ

- REV: コードレビュー依頼
- TST: 実際のマップ表示でのレイヤー重なり順の目視確認を推奨
