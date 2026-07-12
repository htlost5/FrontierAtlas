---
agent: IMP
task_id: TASK-symbol-unification
date: 2026-07-12
status: success
category: log
destination: logs/impl/implementation/
tags:
  - IMP
  - implementation
  - map
  - symbols
  - categories
---

# 実装ログ: 屋内マップシンボル・カテゴリ刷新

## 概要

屋内マップのシンボル・カテゴリ体系を6ゾーン（ZoneType）から8カテゴリ（RoomCategory）に刷新。
合わせて colorTheme のプロパティ名を `zones` → `rooms` に変更。

## 変更ファイル一覧

### 新規作成（2ファイル）
| # | ファイル | 説明 |
|---|----------|------|
| A | `tools/map-assets/scripts/convert-tabler-icons.ts` | Tabler Icons SVG → PNG 変換スクリプト |
| B | `mobile/src/shared/utils/categoryNormalizer.ts` | GeoJSON カテゴリ正規化ユーティリティ |

### 全文書き換え（5ファイル）
| # | ファイル | 説明 |
|---|----------|------|
| 1 | `mobile/src/features/home/map/constants/colorPalette.ts` | `ZoneType` → `RoomCategory`、`ZonePalette` → `RoomCategoryPalette`、`zones` → `rooms` |
| 2 | `mobile/src/features/home/map/layers/floor/unit/rooms/filter.ts` | 40→77カテゴリに拡張、`normalizeCategory` / `CATEGORY_NORMALIZE_MAP` 追加 |
| 3 | `mobile/src/features/home/map/layers/floor/unit/rooms/configs.ts` | `RoomZoneGroup`/`ROOM_ZONE_MAP`/`buildZoneFilter` → `RoomCategoryGroup`/`ROOM_CATEGORY_MAP`/`buildCategoryFilter`、`EXCLUDED_CATEGORIES` 追加 |
| 4 | `mobile/src/features/home/map/renderers/MapIconRegistry.tsx` | アイコンを24個の部屋タイプ別から8カテゴリ別に集約 |
| 5 | `mobile/src/features/home/map/renderers/labels/LabelConfigs.ts` | `ROOM_FILTERS` ベース → `buildCategoryFilter` ベースの8カテゴリラベル設定に変更 |

### 部分修正（7ファイル）
| # | ファイル | 変更内容 |
|---|----------|----------|
| 6 | `mobile/src/features/home/map/layers/floor/unit/rooms/index.tsx` | `ZONES`→`CATEGORIES`、`buildZoneFilter`→`buildCategoryFilter`、`colorTheme.zones`→`colorTheme.rooms` |
| 7 | `mobile/src/features/home/map/layers/floor/types.ts` | `stairsData` プロパティ削除 |
| 8 | `mobile/src/features/home/map/layers/floor/index.tsx` | `stairsData` props 除去、ヌルガード簡素化 |
| 9 | `mobile/src/features/home/map/renderers/UnitSymbol.tsx` | `Vending` import/使用 削除 |
| 10 | `mobile/src/features/home/map/MapScreen.tsx` | `FloorView` への `stairsData` 受け渡し削除 |
| 11 | `mobile/src/features/home/map/layers/floor/section/style.ts` | `ZonePalette` → `RoomCategoryPalette` |
| 12 | `mobile/src/features/home/map/layers/buildings/style.ts` | `ZonePalette` → `RoomCategoryPalette` |
| 13 | `mobile/src/features/home/map/layers/venue/style.ts` | `ZonePalette` → `RoomCategoryPalette` |

### 削除（1ファイル）
| # | ファイル | 理由 |
|---|----------|------|
| — | `mobile/src/features/home/map/renderers/symbols/vending.tsx` | 他ファイルからの参照なし（Vending 削除のため） |

### 変更不要（確認済み）
| # | ファイル | 理由 |
|---|----------|------|
| — | `mobile/src/features/home/map/renderers/MapIconLabel.tsx` | インターフェース変更なし |
| — | `mobile/src/features/home/map/renderers/symbols/MapSymbolIcon.tsx` | 同上 |
| — | `mobile/src/features/home/map/renderers/symbols/toilet.tsx` | 同上 |
| — | `mobile/src/features/home/map/renderers/symbols/elevator.tsx` | 同上 |

### 追加修正（1ファイル、既存エラー）
| # | ファイル | 変更内容 |
|---|----------|----------|
| — | `mobile/src/features/home/map/components/controls/FloorChange.tsx` | `colorTheme.controls` のプロパティ名不一致をマッピングで修正 |

## コンパイル確認
- `npx tsc --noEmit` → エラー0件

## 注意事項
- `convert-tabler-icons.ts` 実行には `sharp` パッケージのインストールが必要
- カテゴリアイコンPNGは既存の部屋タイプ別アイコンを流用しているため、本番では `convert-tabler-icons.ts` で生成したPNGに差し替えること
