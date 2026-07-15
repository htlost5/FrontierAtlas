---
agent: REV
task_id: TASK-room-strip-001
date: 2026-07-15
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-room-strip-001](../shared/tasks/active/TASK-room-strip-001_room-categories-strip.md)"
tags:
  - REV
  - review
  - TASK-room-strip-001
---

# Review Log: Stripped ROOM_CATEGORIES and ROOM_CATEGORY_MAP

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。WARNING なし。コードは仕様通り正しく実装されている。

---

## 検証項目

### 1. COMPLETENESS — ROOM_CATEGORIES vs CATEGORY_CONFIG_TO_GEOJSON ✅

全44の ROOM_CATEGORIES GeoJSON 値を CATEGORY_CONFIG_TO_GEOJSON の値配列要素と交差検証:

| GeoJSON 値 | 所属 config key | 結果 |
|---|---|---|
| classroom | classroom | ✅ |
| study_room | study_room | ✅ |
| library | library | ✅ |
| laboratory | laboratory | ✅ |
| preparation_room | prep_room | ✅ |
| outdoor_practice | outdoor_space | ✅ |
| chemical_prep_room | prep_room | ✅ |
| it_room | it_room | ✅ |
| art_room | art_room | ✅ |
| calligraphy_room | calligraphy_room | ✅ |
| craft_room | workshop | ✅ |
| sewing_room | sewing_room | ✅ |
| kitchen | cooking_room | ✅ |
| audiovisual_room | listening_room | ✅ |
| music_room | music_room | ✅ |
| broadcast_room | broadcasting_room | ✅ |
| studio_room | studio_room | ✅ |
| conference_room | meeting_room | ✅ |
| japanese_style_room | japanese_style_room | ✅ |
| staff_room | staff_room | ✅ |
| first_aid_room | nursery_officce | ✅ |
| printing_room | printing_room | ✅ |
| lounge | lounge | ✅ |
| information_lounge | information_lounge | ✅ |
| information_corner | information_lounge | ✅ |
| restroom_male | male_restroom | ✅ |
| restroom_female | female_restroom | ✅ |
| restroom_accessible | accessible_restroom | ✅ |
| locker_room | locker_area | ✅ |
| dressing_room | changing_room | ✅ |
| elevator | elevator | ✅ |
| stairs | stairs | ✅ |
| lobby | lobby | ✅ |
| vending_area | vending | ✅ |
| emergency_area | emergency_exit | ✅ |
| storage_room | storage | ✅ |
| waste_room | waste_room | ✅ |
| courtyard | courtyard | ✅ |
| open_to_below | atrium | ✅ |
| fire_door | fire_door | ✅ |
| evacuation_exit | emergency_exit | ✅ |
| emergency_exit | emergency_exit | ✅ |
| vending_machine | vending | ✅ |
| locker | locker_area | ✅ |

**判定**: 全44値が CATEGORY_CONFIG_TO_GEOJSON のいずれかの値配列に含まれている。余剰値なし。不足値なし。✅

### 2. CONSISTENCY — ROOM_CATEGORIES vs ROOM_CATEGORY_MAP キー一致 ✅

両オブジェクトのキーセットを比較:

- ROOM_CATEGORIES: 44 keys
- ROOM_CATEGORY_MAP: 44 keys

グループ内訳:
- learning: 3 (classroom, studyRoom, library)
- laboratory: 4 (laboratory, preparationRoom, outdoorPractice, chemicalPrepRoom)
- creative: 10 (itRoom, artRoom, calligraphyRoom, craftRoom, sewingRoom, cookingRoom, audiovisualRoom, musicRoom, broadcastRoom, studioRoom)
- meeting: 2 (conferenceRoom, japaneseStyleRoom)
- staff: 3 (staffRoom, nurseOffice, printingRoom)
- social: 3 (lounge, informationLounge, informationCorner)
- sanitary: 5 (restroomMale, restroomFemale, restroomAccessible, lockerRoom, dressingRoom)
- circulation: 11 (elevator, stairs, lobby, vendingArea, emergencyArea, storageRoom, wasteRoom, courtyard, openToBelow, fireDoor, evacuationExit)
- new: 3 (emergencyExit, vendingMachine, locker)

全キーが完全一致。✅

### 3. RoomCategory GROUPING — 新規3エントリ ✅

| キー | 割当て | 根拠 | 結果 |
|---|---|---|---|
| emergencyExit | circulation | emergency_area/evacuation_exit と同じ circulation グループ | ✅ |
| vendingMachine | circulation | vendingArea と同じ circulation グループ | ✅ |
| locker | sanitary | lockerRoom と同じ sanitary グループ | ✅ |

### 4. EXCLUDED_CATEGORIES — 空 Set の正当性 ✅

- `buildCategoryFilter` は `!EXCLUDED_CATEGORIES.has(geoValue)` でチェック
- Set が空 → 何も除外されない
- 意味論的に正しい: ソースデータから既に不要エントリが除去されているため、ランタイム除外は不要
- 互換性のため空 Set を維持する設計は適切

### 5. NORMALIZE_MAP — 正規化先の存在確認 ✅

| 入力 typo | 正規化先 | ROOM_CATEGORIES に存在? | 結果 |
|---|---|---|---|
| conferenceconference_room | conference_room | ✅ (conferenceRoom) | ✅ |
| conferenceroom | conference_room | ✅ | ✅ |
| restroom.female | restroom_female | ✅ (restroomFemale) | ✅ |
| information-lounge | information_lounge | ✅ (informationLounge) | ✅ |
| labpratory | laboratory | ✅ (laboratory) | ✅ |
| emergency_room | emergency_area | ✅ (emergencyArea) | ✅ |
| storage | storage_room | ✅ (storageRoom) | ✅ |
| art_craft_room | art_room | ✅ (artRoom) | ✅ |

全8エントリの正規化先が ROOM_CATEGORIES に存在することを確認。✅

### 6. Type Safety ✅

`get_errors` で両ファイルともエラーなし。

### 7. BASE_CATEGORIES 相互作用 ✅

BASE_CATEGORIES は `bases/filters.ts` で:
- `atrium: "open_to_below"` → open_to_below は ROOM_CATEGORIES に存在 (circulation)。BaseView と RoomView の両方から参照される既存挙動で問題なし。
- `wall: "concrete"` → concrete は ROOM_CATEGORIES から削除済み。BaseView が個別レイヤで処理するため影響なし。

両システムは異なるソースレイヤを参照するため競合なし。✅

### 8. UnitSymbol アイコン値の存在確認 ✅

UnitSymbol.tsx の iconImageExpression で使用される7値:

| 値 | ROOM_CATEGORIES に存在? | 結果 |
|---|---|---|
| restroom_male | ✅ (restroomMale) | ✅ |
| restroom_female | ✅ (restroomFemale) | ✅ |
| restroom_accessible | ✅ (restroomAccessible) | ✅ |
| elevator | ✅ (elevator) | ✅ |
| vending_machine | ✅ (vendingMachine) | ✅ |
| locker | ✅ (locker) | ✅ |
| emergency_exit | ✅ (emergencyExit) | ✅ |

全7値が存在。POI フィルタ (`getPoiGeoJsonCategories()`) も問題なし。✅

---

## 所見

- 変更は filter.ts (ROOM_CATEGORIES) と configs.ts (ROOM_CATEGORY_MAP) の2ファイル、計44エントリに集約
- category.json の "structure" (visible:true) は CATEGORY_CONFIG_TO_GEOJSON にマッピングがなく、Base システムで concrete を処理するため Room システムに影響なし
- `vending` の visible:false により、`buildCategoryFilter("circulation")` は vending_machine/vending_area を自動除外 → POI アイコンは別レイヤで独立表示されるため正しい挙動
- 3つの新規エントリ (emergencyExit, vendingMachine, locker) は category.json の既存設定と正しく連動

## Findings Summary

| 区分 | 件数 | 内容 |
|---|---|---|
| CRITICAL | 0 | — |
| WARNING | 0 | — |
| INFO | 2 | category.json "structure" は Room システム不使用; vending.visible=false により vending_machine/vending_area ポリゴン非表示 (POI は表示) |
