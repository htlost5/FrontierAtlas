---
agent: IMP
task_id: TASK-{ID}
date: 2026-07-12
status: draft
category: log
destination: logs/impl/implementation/
tags:
  - IMP
  - symbolSortKey
  - overlap-control
---

# Implementation Log: 特殊シンボルのオーバーラップ優先順位制御

## 対応内容
`UnitSymbol.tsx` の `SPECIAL_SYMBOLS` に `symbolSortKey` を導入し、トイレ系シンボルがエレベータより優先表示されるよう修正。

## 変更点
1. `SPECIAL_SYMBOLS` の型定義に `sortKey: number` を追加
2. 各シンボルに優先順位を設定:
   - トイレ系 (restroom_male, restroom_female, restroom_accessible): `sortKey: 3`（最高）
   - エレベータ (elevator): `sortKey: 2`
   - その他 (vending_machine, locker, emergency_exit): `sortKey: 1`
3. `SymbolLayer` の `style` に `symbolSortKey: sortKey` を追加

## MapLibre 仕様
`symbolSortKey` は値が大きいほど `iconAllowOverlap: false` 時に優先表示される。

## 確認事項
- コンパイルエラーなし
- 型安全（sortKey が number 型として正しく設定されている）
