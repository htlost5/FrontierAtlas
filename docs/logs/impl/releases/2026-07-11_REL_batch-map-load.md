---
agent: REL
task_id: TASK-map-batch-data-load
date: 2026-07-11
status: approved
category: log
destination: logs/impl/releases/
related:
  - "[TST テストログ](../../../_inbox/2026-07-11_1130_TST_map-batch-load-test.md)"
  - "[REV 再レビュー](../../../_inbox/2026-07-10_2359_HANDOFF_REV_TST_map-batch-load-re-review.md)"
  - "[REV 一次レビュー](../../../_inbox/2026-07-10_2354_REV_map-batch-load-review.md)"
  - "[IMP 実装ログ](../../../logs/impl/implementation/2026-07-10_IMP_batch-map-load.md)"
  - "[IMP critical fix](../../../logs/impl/implementation/2026-07-10_IMP_critical1-dismiss-fix.md)"
  - "[HANDOFF IMP→REV](../../../_inbox/2026-07-10_HANDOFF_IMP_REV_TASK-map-batch-data-load.md)"
tags:
  - REL
  - release
  - map-batch-load
  - refactor
---
# Release — マップデータ一括ロード実装

## コミット情報
| 項目 | 値 |
|------|-----|
| コミットハッシュ | `537ec7b` |
| ブランチ | `main` |
| 日付 | 2026-07-11 |
| 直前タグ | `v0.16.3` |

## 変更概要
**refactor(map): batch-load GeoJSON data before MapLibre mount**

MapLibre マップデータの「逐次描画」から「一括ロード→一括描画」方式への再設計。

### 新規ファイル（4件）
| ファイル | 説明 |
|----------|------|
| `mobile/src/features/home/map/hooks/dataLoad/useBatchMapData.ts` | 6並列 Promise.all 一括取得フック |
| `mobile/src/features/home/map/components/FullScreenLoading.tsx` | 初回ロード用全画面ローディング |
| `mobile/src/features/home/map/components/ErrorOverlay.tsx` | エラー用オーバーレイ（fullscreen/overlay 2variant） |
| `docs/` 配下ハンドオフ文書・ログ x6 | REV/TST/REL 工程成果物 |

### 変更ファイル（2件）
| ファイル | 説明 |
|----------|------|
| `mobile/src/features/home/map/MapScreen.tsx` | 3-state rendering に書き換え |
| `mobile/AGENTS.md` | テスト手順追記（expo-doctor） |
| `mobile/src/features/home/map/context/MapContext.ts` | コメント追記 |

### 削除ファイル（4件）
| ファイル | 説明 |
|----------|------|
| `mobile/src/features/home/map/components/LoadingOverlay.tsx` | 逐次描画用ローディング（廃止） |
| `mobile/src/features/home/map/hooks/dataLoad/useMapGeoData.ts` | 逐次描画用フック（廃止） |
| `mobile/src/features/home/map/hooks/dataLoad/useFloorGeoData.ts` | 同上 |
| `mobile/src/features/home/map/hooks/dataLoad/useGeoDataByLogicalId.ts` | 同上 |

## 品質ゲート
| チェック | 結果 |
|----------|------|
| コードレビュー | ✅ PASS（REV conditional approval, 2 passes） |
| テスト | ✅ PASS（TST 全6項目合格） |
| ビルド | スキップ（Expo プロジェクト、ビルド指示なし） |
| git push | スキップ（ORC 指示待ち） |

## 注意点
- バージョンバンプは未実施（ORC 指示による次回リリース時に standard-version で一括実施想定）
- git push 未実行のためリモート未反映
