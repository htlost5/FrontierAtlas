---
agent: REL
task_id: (handoff from TST)
date: 2026-07-11
status: approved
category: log
destination: logs/impl/releases/
related: []
tags: [REL, release, map-redesign]
---

# Release — Indoor Map Redesign

## コミット情報
| 項目 | 値 |
|------|-----|
| コミットハッシュ | `1255e62` |
| ブランチ | `main` |
| 日付 | 2026-07-11 |

## 変更概要
マップ表示デザインを全面刷新（26ファイル、428 insertions / 265 deletions）

### 新規ファイル（2）
- `mobile/src/features/home/map/constants/colorPalette.ts` — 6グループの機能別ゾーン配色
- `mobile/src/features/home/map/hooks/state/useColorTheme.ts` — useColorScheme 連動テーマ

### 変更ファイル（24）
- 配色刷新（6グループ機能別ゾーン配色 + ミュートトーン）
- ダークモード対応（useColorScheme 連動）
- カメラ制御最適化（初期zoom 17.5、範囲 [16.8, 20.8]）
- フロア切替UI改善（視覚的フィードバック強化、ハプティクス追加）
- ラベルにテキストハロー追加、フォント Medium化
- WCAG 2.1 AA 準拠のコントラスト設計

## 検証ステータス
| チェック | 結果 |
|----------|------|
| コードレビュー | ✅ |
| テスト | ✅ |

## 注意点
- バージョンバンプ未実施（standard-version 未実行）
- git push 未実施
- 通常の feat コミットとして記録
