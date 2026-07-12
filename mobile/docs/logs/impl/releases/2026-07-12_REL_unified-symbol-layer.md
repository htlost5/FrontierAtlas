---
agent: REL
task_id: TASK-unified-symbol-layer
date: 2026-07-12
status: approved
category: log
destination: logs/impl/releases/
related:
  - "[UnitSymbol.tsx](../../../../src/features/home/map/renderers/UnitSymbol.tsx)"
  - "[IMP Log](../implementation/2026-07-12_IMP_unified-symbol-layer.md)"
  - "[TST Log](../testing/2026-07-12_TST_unified-symbol-layer-validation.md)"
tags:
  - REL
  - release
  - symbol-layer
  - refactor
---

# Release: 統合 SymbolLayer 化 (refactor/map)

## コミット情報

| 項目 | 値 |
|------|-----|
| コミットハッシュ | `c9b5ca9` |
| ブランチ | `main` |
| タグ | なし（バージョンバンプなしの単発コミット） |
| 日付 | 2026-07-12 |

## 変更概要

- **7個の個別 SymbolLayer → 1個の統合 SymbolLayer に集約**
  - `SPECIAL_SYMBOLS` マップ配列ループを廃止
  - 代わりに `iconImageExpression` と `sortKeyExpression` の 2つの `match` expression でデータ駆動化
- **iconImage**: category → アイコン名を `match` expression で解決
- **symbolSortKey**: category → 数値キーを `match` expression で解決
  - トイレ系 (1) > エレベータ (2) > その他 (3) > fallback (999) の優先順位
- **ファイル変更**: `UnitSymbol.tsx` — 67行追加 / 48行削除

## 変更ファイル

| ファイル | 変更種別 |
|----------|----------|
| `src/features/home/map/renderers/UnitSymbol.tsx` | 変更 |

## 検証ステータス

| チェック | 結果 |
|----------|------|
| TypeScript 型チェック | ✅ |
| ESLint | ✅ |
| コードレビュー (REV) | ✅ |
| テスト (TST) — 6観点 | ✅ |
| git push | ⏭️ スキップ（ORC 指示による） |

## 注意点

- 本コミットは `v0.16.3` タグ以降の変更として積み上げ。別途バージョンバンプは未実施。
- 未追跡のドキュメントファイル（IMP ログ・TST ログ等）が残っている。必要に応じて別コミットで管理。
