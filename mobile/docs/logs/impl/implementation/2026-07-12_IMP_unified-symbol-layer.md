---
agent: IMP
task_id: TASK-unified-symbol-layer
date: 2026-07-12
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[UnitSymbol.tsx](../../../../src/features/home/map/renderers/UnitSymbol.tsx)"
tags:
  - IMP
  - maplibre
  - symbol-layer
  - symbol-sort-key
---

# 実装ログ: 統合 SymbolLayer への集約

## 概要
7個の個別 SymbolLayer で管理していた特殊シンボル（トイレ・エレベータ・自販機・ロッカー・非常口）を、
1個の統合 SymbolLayer に集約し、`symbolSortKey` が同一レイヤー内フィーチャー間で正しく機能するよう修正した。

## 修正内容

### 変更前の問題
- 各シンボル種別が7個の別々の SymbolLayer に分かれていた
- MapLibre 公式仕様では `symbolSortKey` は**同一 SymbolLayer 内のフィーチャー間でのみ有効**
- 別レイヤーではレイヤーZ順序による描画制御しか効かず、真のオーバーラップ優先制御ができていなかった

### 変更後
- 1個の統合 `SymbolLayer`（`unit-symbol-layer`）に集約
- `iconImage`: `match` expression で category → imageKey をデータ駆動マッピング
- `symbolSortKey`: `match` expression で category → sortKey をデータ駆動マッピング
  - トイレ系（sortKey=1）: 最高優先
  - エレベータ（sortKey=2）: 中優先
  - その他（sortKey=3）: 最低優先
- `SPECIAL_SYMBOLS` 配列を削除し、expression 内で直接マッピング

### 削除したもの
- `SPECIAL_SYMBOLS` 定数配列
- 7個の個別 `<SymbolLayer>` 要素

## 検証
- TypeScript コンパイルエラーなし
- `Expression` 型で `iconImage` / `symbolSortKey` を正しく型付け
