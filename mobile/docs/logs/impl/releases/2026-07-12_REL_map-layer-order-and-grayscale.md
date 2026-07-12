---
agent: REL
task_id: TASK-map-layer-order-and-grayscale
date: 2026-07-12
status: approved
category: log
destination: logs/impl/releases/
related:
  - "[2026-07-12_REL_sortkey-priority.md](./2026-07-12_REL_sortkey-priority.md)"
  - "[2026-07-12_REL_unified-symbol-layer.md](./2026-07-12_REL_unified-symbol-layer.md)"
tags: [REL, release, map, layer-order, grayscale]
---

# Release — マップレイヤー順序調整とグレーアウト実装

## コミット情報
| 項目 | 値 |
|------|-----|
| コミットハッシュ | `60bfd9b` |
| ブランチ | `main` |
| 日付 | 2026-07-12 |

## 変更概要
- レイヤー順序を「地物描画(FloorView)→特殊シンボル(UnitSymbol)→通常シンボル(MapIconLabel)→グレーアウト(BuildingsView)」に変更
- zoom < 18.0 (buildingモード) で全シンボルをグレーアウト
- UnitSymbol を MapIconLabel から分離し単独レイヤー制御可能に
- processUnitData ユーティリティを新規作成

## 検証ステータス
| チェック | 結果 |
|----------|------|
| TypeScript 型チェック | ✅ |
| コードレビュー | ✅ |
| テスト | ✅ |
| ビルド | スキップ（Expo プロジェクト） |
| git push | ✅ |

## 注意点
- リモートリポジトリに 1件の dependabot moderate vulnerability が検出されています（本リリース起因ではありません）
