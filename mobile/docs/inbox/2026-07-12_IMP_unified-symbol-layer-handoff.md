---
agent: IMP
task_id: TASK-unified-symbol-layer
date: 2026-07-12
status: pending
category: shared
destination: shared/impl/logs/implementation/
tags:
  - IMP
  - REV
  - handoff
  - symbol-layer
---

## HANDOFF to REV

- **status**: success
- **confidence**: high
- **artifacts**:
  - `src/features/home/map/renderers/UnitSymbol.tsx`（修正済み）
  - `docs/logs/impl/implementation/2026-07-12_IMP_unified-symbol-layer.md`（実装ログ）
- **open_questions**: なし
- **routing**: REV → TST → REL
- **design_summary**: 7個の個別 SymbolLayer を1個の統合 SymbolLayer に集約。`iconImage` と `symbolSortKey` を match expression でデータ駆動化。symbolSortKey が同一レイヤー内フィーチャー間で有効になるよう修正。

### 変更概要
1. `SPECIAL_SYMBOLS` 配列を削除し、代わりに `iconImageExpression`（match式）と `sortKeyExpression`（match式）を定義
2. 7個の `<SymbolLayer>` を1個の `unit-symbol-layer` に統合
3. `symbolSortKey` に data-driven expression を設定し、sortKey が小さいトイレ系（sortKey=1）が優先配置される
4. 型エラー回避のため `as unknown as Expression` でキャスト（既存の `zoomInterpolate` と同パターン）
5. コンパイルエラーなし確認済み
