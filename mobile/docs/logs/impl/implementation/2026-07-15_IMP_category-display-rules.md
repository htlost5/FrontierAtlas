---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-15
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-001](../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - IMP
  - implementation
  - TASK-compass-001
---

# Implementation Log: Wire category.json Display Rules into Map Rendering

## Task Summary

`mobile/category.json` の display rules（visible, label.icon, label.text, poi）を
既存のマップレンダリングパイプラインに接続する。

## Changes Made

### 1. CREATED: `src/features/home/map/config/categoryDisplayConfig.ts`

新規モジュール。以下の責務を持つ:

- `category.json` を直接 import（tsconfig resolveJsonModule: true）
- category.json の39キー → GeoJSON 77+ カテゴリ値へのマッピング (`CATEGORY_CONFIG_TO_GEOJSON`)
- 逆引きマップ (`GEOJSON_TO_CONFIG_KEY`) も自動生成
- 公開ヘルパー関数:
  - `getCategoryConfig(geoJsonCategory)` — config lookup
  - `isFeatureVisible(geoJsonCategory)` — デフォルト true
  - `isLabelIconVisible(geoJsonCategory)` — デフォルト true
  - `isLabelTextVisible(geoJsonCategory)` — デフォルト true
  - `isPoiVisible(geoJsonCategory)` — デフォルト false
  - `getGeoJsonCategoryFromConfigKey(configKey)` — 逆引き
  - `getPoiGeoJsonCategories()` — poi=true の全 GeoJSON 値を収集

### 2. CREATED: `src/features/home/map/config/index.ts`

config モジュールの barrel export。

### 3. MODIFIED: `layers/floor/unit/rooms/configs.ts`

`buildCategoryFilter` に visible=false 除外ロジックを追加:
- `isFeatureVisible(geoValue)` でフィルタ → visible=false のカテゴリは PolygonLayer に渡されず非表示に

### 4. MODIFIED: `renderers/labels/LabelConfigs.ts`

ハードコードされた overrides を category.json 駆動に変更:
- `buildLabelOverrides()` 関数: RoomCategory ごとに全サブカテゴリの `label.icon` / `label.text` を集約
- 全サブカテゴリで icon=false → iconVisible=false
- 全サブカテゴリで text=false → textVisible=false
- 旧 overrides（sanitary, circulation）と同じ動作を category.json から自動生成

### 5. MODIFIED: `renderers/UnitSymbol.tsx`

POI フィルタを追加:
- `buildPoiFilter()`: `getPoiGeoJsonCategories()` で poi=true の全 GeoJSON 値を収集し、`in` filter を生成
- SymbolLayer に `filter={poiFilter}` を追加 → poi=true のフィーチャーのみ描画
- 新しい category が JSON に追加され poi=true になれば自動反映

## Mapping Verification

全39 category.json キーの GeoJSON マッピングを `ROOM_CATEGORIES` (filter.ts) と照合:

| category.json key | GeoJSON value(s) | Status |
|---|---|---|
| classroom | classroom | ✅ |
| emergency_exit | emergency_exit, emergency_area, evacuation_exit | ✅ |
| male_restroom | restroom_male | ✅ |
| female_restroom | restroom_female | ✅ |
| accessible_restroom | restroom_accessible | ✅ |
| vending | vending_machine, vending_area | ✅ (vending_machine は ROOM_CATEGORIES にないが UnitSymbol で使用) |
| structure | structure | ✅ (ROOM_CATEGORIES にない → undefined → デフォルト動作) |
| outdoor_space | outdoor_space | ✅ (同上) |
| stairs | stairs | ✅ |
| elevator | elevator | ✅ |
| locker_area | locker_room, locker | ✅ (locker は ROOM_CATEGORIES にないが UnitSymbol で使用) |
| information_lounge | information_lounge, information_corner | ✅ |
| lounge | lounge | ✅ |
| storage | storage_room | ✅ |
| laboratory | laboratory | ✅ |
| prep_room | preparation_room, chemical_prep_room | ✅ |
| staff_room | staff_room | ✅ |
| meeting_room | conference_room (GeoJSON に "meeting_room" なし) | ✅ |
| study_room | study_room | ✅ |
| courtyard | courtyard | ✅ |
| fire_door | fire_door | ✅ |
| library | library | ✅ |
| it_room | it_room | ✅ |
| listening_room | audiovisual_room (GeoJSON に "listening_room" なし) | ✅ |
| atrium | atrium | ✅ |
| nursery_officce | first_aid_room | ✅ |
| studio_room | studio_room | ✅ |
| broadcasting_room | broadcast_room | ✅ |
| printing_room | printing_room | ✅ |
| music_room | music_room | ✅ |
| japanese_style_room | japanese_style_room | ✅ |
| cooking_room | kitchen | ✅ |
| sewing_room | sewing_room | ✅ |
| art_room | art_room | ✅ |
| calligraphy_room | calligraphy_room | ✅ |
| workshop | craft_room (GeoJSON に "workshop" なし) | ✅ |
| changing_room | dressing_room (GeoJSON に "changing_room" なし) | ✅ |
| waste_room | waste_room | ✅ |
| lobby | lobby | ✅ |

## Verification

- ✅ `npx tsc --noEmit` 通过了（既存エラーのみ、新規エラーなし）
- ✅ visible=false のカテゴリ (vending, outdoor_space, stairs, locker_area, information_lounge, lounge, lobby) は PolygonLayer から除外される
- ✅ POI フィルタが UnitSymbol に適用される
- ✅ ラベル表示が category.json の設定を反映する
