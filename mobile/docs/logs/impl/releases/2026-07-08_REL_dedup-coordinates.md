---
agent: REL
task_id: TASK-dedup-coordinates
date: 2026-07-08
status: approved
category: log
destination: logs/impl/releases/
related:
  - "[HANDOFF TST->REL](../_inbox/2026-07-08_HANDOFF_TST_REL_dedup-coordinates.md)"
  - "[IMP Log](../logs/impl/implementation/2026-07-08_IMP_dedup-coordinates.md)"
  - "[REV Log](../logs/impl/review/2026-07-08_REV_coordinate-dedup.md)"
  - "[TST Log](../logs/impl/testing/2026-07-08_TST_dedup-coordinates.md)"
tags:
  - REL
  - release
  - v0.0.0
  - coordinate-dedup
---

# Release — Coordinate Deduplication Fix

## コミット情報
| 項目 | 値 |
|------|-----|
| コミットハッシュ | de4ef6 |
| ブランチ | main |
| タグ | なし（R2 v0.0.0 データは別途手動アップロード） |
| 日付 | 2026-07-08 |

## 変更概要

| ファイル | 変更 |
|----------|------|
| 	ools/map-assets/transformer/transform.js | coordinatesEqual, emoveConsecutiveDuplicates, sanitizeGeometry, sanitizeFeature 追加 |
| docs/_inbox/ (5 files) | IMP→REV, TST→REL ハンドオフ文書 |
| docs/logs/impl/ (4 files) | 実装・レビュー・テストログ |

**統計**: 10 files changed, 691 insertions(+)

## R2 デプロイ確認
| チェック | 結果 |
|----------|------|
| ersion.json | ✅ 配置済み |
| manifest.json | ✅ 配置済み |
| imdf/studyhall/sections/floor1.json | ✅ 配置済み |

## 重複確認結果
- **全414リング** スキャン済み — 0 consecutive duplicates
- floor3.json の1リングで 2e-14 deg の浮動小数点誤差（影響なし）

## 検証ステータス
| チェック | 結果 |
|----------|------|
| コードレビュー (REV) | ✅ 承認 |
| テスト (TST) | ✅ ALL PASS |
| R2 デプロイ (IMP 実行) | ✅ 確認済み |
| git コミット | ✅ de4ef6 |
| バージョンバンプ | スキップ（コード修正のみ、モバイルアプリ不変） |
| git push | スキップ（ORC 指示待ち） |

## 注意点
- 本リリースは地図データパイプラインの修正であり、モバイルアプリのバージョンバンプは不要
- R2 の 0.0.0 データは IMP により手動アップロード済み
- gh-pages への自動デプロイ（GitHub Actions）は * タグプッシュ時のみ発火 — タグ未作成のため未実行
- Worker (geo-data-push) の DNS ルーティング未確認 — 動作確認は ORC 判断に委ねる

## ジオデータバージョン管理
| 項目 | 値 |
|------|-----|
| R2 バケット | geo-data-frontieratlas |
| リリースパス | eleases/v0.0.0/ |
| データソース | GitHub Pages htlost5.github.io/geo-data-repo |
