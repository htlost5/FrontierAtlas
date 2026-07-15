---
agent: REL
task_id: TASK-studyhall-layers
date: 2026-07-15
status: approved
category: log
destination: docs/logs/impl/releases/
related:
  - "[TASK-studyhall-layers](../../shared/tasks/active/TASK-studyhall-layers_compass-feature.md)"
tags:
  - REL
  - release
  - v0.17.1
  - TASK-studyhall-layers
---

# Release v0.17.1 — Studyhall Surface Layers

## コミット情報
| 項目 | 値 |
|------|-----|
| コミットハッシュ | `01cd7cf` |
| ブランチ | main |
| タグ | v0.17.1 |
| 日付 | 2026-07-15 |

## 変更概要
### Features
- **mobile:** add floor-specific surface layers to studyhall MapLibre rendering

### 変更ファイル（11 files）
| 種別 | ファイル | 変更 |
|------|----------|------|
| NEW | `assets/maps/imdf/studyhall/surface/{1F,2F,3F,4F,5F}.json` | 5枚の surface GeoJSON データ |
| MOD | `assets/maps/manifest.json` | 5件の surface エントリ追加（count: 22→27） |
| MOD | `src/data/geojson/geojsonAssetMap.ts` | surface インポート追加 |
| MOD | `src/features/home/map/constants/colorPalette.ts` | surface 配色（Light/Dark）追加 |
| MOD | `src/features/home/map/hooks/dataLoad/useBatchMapData.ts` | FloorGeoData + surface 読み込み |
| NEW | `src/features/home/map/layers/floor/surface/index.tsx` | SurfaceLayer コンポーネント |
| MOD | `src/features/home/map/layers/floor/index.tsx` | FloorView（SectionView→SurfaceLayer） |
| MOD | `src/features/home/map/layers/floor/types.ts` | FloorProps 拡張 |
| DOC | `docs/logs/impl/implementation/2026-07-15_IMP_surface-layers.md` | IMP 実装ログ |
| DOC | `docs/logs/impl/review/2026-07-15_REV_surface-layers.md` | REV レビューログ |
| DOC | `docs/logs/impl/testing/2026-07-15_TST_surface-layers.md` | TST テストログ |

## レイヤー構成（下→上）
| フロア | 構成 |
|--------|------|
| 1F-3F | venue → {N}F_surface(opacity:1.0) → rooms |
| 4F-5F | venue → 3F_surface(underlay, opacity:0.5) → {N}F_surface(opacity:1.0) → rooms |

## 検証ステータス
| チェック | 結果 |
|----------|------|
| TypeScript 型チェック | ✅ PASS（変更7ファイル: 全エラー0件） |
| ESLint | ✅ PASS |
| コードレビュー | ✅ PASS（REV 承認） |
| テスト | ✅ PASS（11/11 全項目合格） |
| ビルド | ⏭️ スキップ（ORC 指示待ち） |
| git push | ⏭️ スキップ（ORC 指示待ち） |

## 注意点
- 初回 standard-version dry-run は未コミットの feat を検出できず v0.17.1 と表示。コミット後に改めて dry-run → 同じく v0.17.1（patch）で妥当
- 2件の pre-existing TypeScript エラー（app.config.ts, MapContainer.tsx）は変更対象外
- git push 未実行（ORC 指示がないためデフォルトでスキップ）
- EAS build 未実行（ORC 指示がないためスキップ）
