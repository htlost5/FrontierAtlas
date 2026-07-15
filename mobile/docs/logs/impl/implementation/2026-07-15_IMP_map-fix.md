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

# Implementation Log: Map Display Bug Fixes

## Overview

2件のマップ表示不具合を修正。

---

## Fix #1: POI 特殊シンボルのカテゴリ値不一致

**ファイル**: `src/features/home/map/renderers/UnitSymbol.tsx`

**問題**: `iconImageExpression` と `sortKeyExpression` 内の match 式で使われていたカテゴリ値 (`restroom_male`, `restroom_female`, 等) が、実際のデータ値 (`male_restroom` 等) と不一致だった。

**修正**: 以下の置換を両方の match 式で実施:
| 修正前 | 修正後 |
|---|---|
| `restroom_male` | `male_restroom` |
| `restroom_female` | `female_restroom` |
| `restroom_accessible` | `accessible_restroom` |
| `vending_machine` | `vending` |
| `locker` | `locker_area` |

`elevator`, `emergency_exit` は既に正しかったため修正不要。

---

## Fix #2: `structure` カテゴリが ROOM_CATEGORIES に未登録

**問題**: `category.json` に `structure` が定義されているが、`ROOM_CATEGORIES` と `ROOM_CATEGORY_MAP` に存在しなかったため、structure カテゴリの地物がどのフィルタにも合致せず描画されなかった。

**修正**:
1. `filter.ts` — `ROOM_CATEGORIES` の `// circulation` セクションに `structure: "structure"` を追加
2. `configs.ts` — `ROOM_CATEGORY_MAP` の `// circulation` セクションに `structure: "circulation"` を追加

---

## Verification

- TypeScript コンパイルエラーなし（get_errors で確認済）
- `structure` 追加により `buildCategoryFilter("circulation")` に自動的に含まれる
- `isFeatureVisible("structure")` は `category.json` の `visible: true` により `true` を返す
