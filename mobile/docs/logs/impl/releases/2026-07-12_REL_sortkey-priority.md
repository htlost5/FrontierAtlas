---
agent: REL
task_id: TASK-fix-sortKey-inversion
date: 2026-07-12
status: approved
category: log
destination: logs/impl/releases/
related:
  - "[TST テストログ](../testing/2026-07-12_TST_sortKey-fix-validation.md)"
tags: [REL, release, sortKey, priority]
---

# Release: sortKey 優先順位修正

## コミット情報
| 項目 | 値 |
|------|-----|
| コミットハッシュ | c7172d3 |
| ブランチ | main |
| タグ | なし |
| 日付 | 2026-07-12 |

## 変更概要
`UnitSymbol.tsx` の特殊シンボルに `symbolSortKey` を追加し、`iconAllowOverlap: false` 時の重なり表示優先順位を制御。

- トイレ系（restroom_male/female/accessible）: sortKey=1（最高優先）
- エレベータ: sortKey=2
- その他（vending_machine, locker, emergency_exit）: sortKey=3（最低優先）
- iconAllowOverlap: true → false に変更
- アイコンサイズ調整: [17, 0.25]/[20, 0.38] → [17, 0.15]/[21, 0.35]
- MapIconLabel: UnitSymbol の isVisible を常時 1 に固定（ラベル表示に依存しない）

## 検証ステータス
| チェック | 結果 |
|----------|------|
| TypeScript 型チェック | ✅ |
| ESLint | ✅ |
| コードレビュー | ✅ |
| テスト | ✅ |
| ビルド | スキップ |
| git push | スキップ |

## 注意点
- 本リリースは git push 未実施。必要に応じて `git push --follow-tags origin main` を実行すること。
- バージョンバンプは未実施（standard-version 未使用）。
