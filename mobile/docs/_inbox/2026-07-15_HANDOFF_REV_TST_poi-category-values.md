---
agent: REV
task_id: TASK-poi-category-001
date: 2026-07-15
status: pending
category: shared
destination: shared/impl/specs/interfaces/
related:
  - "[REV Log](../logs/impl/review/2026-07-15_REV_poi-category-values.md)"
tags:
  - REV
  - TST
  - handoff
  - TASK-poi-category-001
---

# HANDOFF: REV → TST

## Task Context (継承)

**POI カテゴリ値修正 + structure 追加**

IMP が以下を変更:
1. `UnitSymbol.tsx` — `iconImageExpression` / `sortKeyExpression` の match 式で POI 特殊シンボルのカテゴリ値5件を修正
   - `restroom_male` → `male_restroom`
   - `restroom_female` → `female_restroom`
   - `restroom_accessible` → `accessible_restroom`
   - `vending_machine` → `vending`
   - `locker` → `locker_area`
2. `filter.ts` — `ROOM_CATEGORIES` に `structure: "structure"` を追加
3. `configs.ts` — `ROOM_CATEGORY_MAP` に `structure: "circulation"` を追加

---

## REV 判定

| 項目 | 値 |
|------|-----|
| 判定 | ✅ 承認 |
| 確信度 | high |
| CRITICAL | 0件 |

---

## 変更ファイル

| ファイル | 変更内容 |
|----------|----------|
| `mobile/src/features/home/map/renderers/UnitSymbol.tsx` | カテゴリ値5件修正（iconImageExpression, sortKeyExpression） |
| `mobile/src/features/home/map/layers/floor/unit/rooms/filter.ts` | ROOM_CATEGORIES に `structure` 追加 |
| `mobile/src/features/home/map/layers/floor/unit/rooms/configs.ts` | ROOM_CATEGORY_MAP に `structure: "circulation"` 追加 |

---

## レビューサマリ

- 修正後のカテゴリ値は全5件 `ROOM_CATEGORIES` と完全一致 ✅
- `structure` は `ROOM_CATEGORIES` / `ROOM_CATEGORY_MAP` 両方に正しく追加済み ✅
- `structure` は `poi: false` → `getPoiGeoJsonCategories()` に含まれず、UnitSymbol に表示されない ✅
- 型エラー・構文エラーなし（3ファイルすべて） ✅
- 他ファイルへの副作用なし ✅

---

## テスト内容

1. TypeScript コンパイルが通ることの確認
2. 修正ファイル（3ファイル）の構文チェック
3. 全5件のカテゴリ値が ROOM_CATEGORIES と一致することの確認
