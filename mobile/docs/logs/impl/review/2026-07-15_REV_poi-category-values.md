---
agent: REV
task_id: TASK-poi-category-001
date: 2026-07-15
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-poi-category-001](../shared/tasks/active/TASK-poi-category-001.md)"
tags:
  - REV
  - review
  - TASK-poi-category-001
---

# Review Log: POI Category Value Correction + structure Addition

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。WARNING なし。コードは仕様通り正しく実装されている。

---

## 検証項目

### 1. UnitSymbol.tsx — POI 特殊シンボルカテゴリ値の一致確認

| 修正後 (UnitSymbol.tsx) | ROOM_CATEGORIES (filter.ts) | 一致 |
|---|---|---|
| `male_restroom` | `male_restroom` | ✅ |
| `female_restroom` | `female_restroom` | ✅ |
| `accessible_restroom` | `accessible_restroom` | ✅ |
| `vending` | `vending` | ✅ |
| `locker_area` | `locker_area` | ✅ |

修正前の旧値（`restroom_male`, `restroom_female`, `restroom_accessible`, `vending_machine`, `locker`）は ROOM_CATEGORIES に存在しない値だった。今回の修正で完全に一致した。✅

### 2. `structure` の追加確認

| ファイル | エントリ | 結果 |
|---|---|---|
| `filter.ts` → `ROOM_CATEGORIES` | `structure: "structure"` | ✅ |
| `configs.ts` → `ROOM_CATEGORY_MAP` | `structure: "circulation"` | ✅ |

`ROOM_CATEGORY_MAP` に `structure` が circulation カテゴリとして追加されているため、`buildCategoryFilter("circulation")` の結果に `"structure"` が含まれる。✅

### 3. `structure` の POI 表示確認

`category.json` の `structure` 設定:
```json
"structure": {
  "visible": true,
  "label": { "icon": false, "text": false },
  "poi": false
}
```

- `poi: false` → `getPoiGeoJsonCategories()` の戻り値に含まれない
- → `UnitSymbol`（POI フィルタ使用）に structure が表示されることはない ✅
- → 意図通り（structure は特殊シンボル非表示でOK）

### 4. 型エラー・構文エラー

| ファイル | 結果 |
|---|---|
| `UnitSymbol.tsx` | ✅ エラーなし |
| `filter.ts` | ✅ エラーなし |
| `configs.ts` | ✅ エラーなし |

### 5. 他ファイルへの副作用

- `categoryDisplayConfig.ts` は `ROOM_CATEGORIES` をインポートし、逆引きマップを動的構築 → 自動的に `structure` を認識 ✅
- `buildCategoryFilter("circulation")` が structure を含むようになるが、structure の `visible: true` であるためフィルタ動作に影響なし ✅

---

## 所見

- 修正は3ファイル・計6行の最小限変更
- 旧値（`restroom_male`, `restroom_female`, `restroom_accessible`, `vending_machine`, `locker`）は ROOM_CATEGORIES との非互換の原因だったが、今回の修正で解消済み
- `structure` の追加は `ROOM_CATEGORIES` と `ROOM_CATEGORY_MAP` の両方に一致しており整合性担保済み
- 副作用なし。全項目合格。
