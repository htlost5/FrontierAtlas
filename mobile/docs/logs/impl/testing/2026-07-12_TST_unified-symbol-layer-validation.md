---
agent: TST
task_id: TASK-unified-symbol-layer
date: 2026-07-12
status: approved
category: log
destination: logs/impl/testing/
related:
  - "[UnitSymbol.tsx](../../../../src/features/home/map/renderers/UnitSymbol.tsx)"
  - "[IMP Log](../implementation/2026-07-12_IMP_unified-symbol-layer.md)"
tags:
  - TST
  - testing
  - symbol-layer
  - match-expression
---

# Testing Log: 統合 SymbolLayer 化の検証

## テスト対象
- `d:\htlost5-workspace\projects\frontieratlas\mobile\src\features\home\map\renderers\UnitSymbol.tsx`

## テスト観点と結果

### 1. TypeScript コンパイルエラーがないか ✅
- コマンド: `npx tsc --noEmit --pretty`
- 結果: **exit code 0、エラー出力なし**
- 型チェック正常通過

### 2. `match` expression のフォーマットが有効か（引数の数が偶数か） ✅
- `iconImageExpression`: `["match", ["get", "category"], key1, val1, key2, val2, ..., fallback]`
  - 7ペア（14引数）+ fallback（1）= 合計16引数（match + get + 偶数ペア + fallback で構文成立）
  - **全7カテゴリをカバー、fallback に空文字を設定**
- `sortKeyExpression`: `["match", ["get", "category"], key1, val1, key2, val2, ..., fallback]`
  - 7ペア（14引数）+ fallback（1）= 合計16引数
  - **ペア数が偶数で、fallback 値で終了している。構文として有効**

### 3. `symbolSortKey` の優先順位が正しいか ✅
MapLibre 公式仕様: `symbolSortKey` は値が小さいほど優先表示（`iconAllowOverlap=false` 時）

| category | sortKey | 優先順位 | 判定 |
|----------|---------|----------|------|
| restroom_male | 1 | 最高 | ✅ |
| restroom_female | 1 | 最高 | ✅ |
| restroom_accessible | 1 | 最高 | ✅ トイレ系: 最も優先表示 |
| elevator | 2 | 中 | ✅ |
| vending_machine | 3 | 低 | ✅ |
| locker | 3 | 低 | ✅ |
| emergency_exit | 3 | 低 | ✅ |
| fallback | 999 | 最低 | ✅ |

**優先順位: トイレ系(1) > エレベータ(2) > その他(3) > fallback(999)**

### 4. `iconImage` のカテゴリマッピングが全7種をカバーしているか ✅
| category | iconImage | 判定 |
|----------|-----------|------|
| restroom_male → special-toilet-male | ✅ |
| restroom_female → special-toilet-female | ✅ |
| restroom_accessible → special-toilet-accessible | ✅ |
| elevator → special-elevator | ✅ |
| vending_machine → special-vending | ✅ |
| locker → special-locker | ✅ |
| emergency_exit → special-emergency-exit | ✅ |
| fallback → ""（空文字 = 非表示） | ✅ |

**全7種のマッピングが過不足なく定義され、fallback も設定済み**

### 5. `iconAllowOverlap: false` が設定されているか ✅
- `UnitSymbol.tsx` の `SymbolLayer` style 内に `iconAllowOverlap: false` が明示的に記述されている
- `symbolSortKey` と組み合わせて正しく機能する構成

### 6. 統合レイヤー構造が論理的に正しいか ✅
- `ShapeSource`（`unit-symbols-source`）配下に単一の `SymbolLayer`（`unit-symbol-layer`）
- `iconImage`: `match` expression で category → アイコン名をデータ駆動
- `symbolSortKey`: `match` expression で category → 数値キーをデータ駆動
- MapLibre 公式仕様どおり、`symbolSortKey` は同一 SymbolLayer 内のフィーチャー間でのみ有効
- **7個の個別レイヤー時代の問題（別レイヤー間では sortKey が機能しない）を解決し、論理的に正しい構造**

### 7. 補足: ESLint チェック ✅
- `npx eslint src/features/home/map/renderers/UnitSymbol.tsx`
- **exit code 0、エラー・警告なし**

## 総合判定: ✅ 合格

全7観点（6必須 + 1補足）すべて合格。IMP の実装は正しく、REV の承認どおり品質に問題なし。

## 引き継ぎ情報

### HANDOFF to REL
- **status**: success
- **confidence**: high
- **artifacts**: `d:\htlost5-workspace\projects\frontieratlas\mobile\src\features\home\map\renderers\UnitSymbol.tsx`
- **open_questions**: なし
- **routing**: REL → ORC
- **test_result**: 全7観点合格。TypeScript コンパイル、match expression 構文、sortKey 優先順位、カテゴリカバレッジ、iconAllowOverlap、レイヤー構造、Lint すべて問題なし。
