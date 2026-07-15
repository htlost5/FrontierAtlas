---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-15
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[categoryDisplayConfig.ts](../../../../src/features/home/map/config/categoryDisplayConfig.ts)"
  - "[filter.ts (ROOM_CATEGORIES)](../../../../src/features/home/map/layers/floor/unit/rooms/filter.ts)"
tags:
  - IMP
  - implementation
  - bugfix
  - category-mapping
---

# Implementation Log: Fix Invalid Mappings in categoryDisplayConfig.ts

## Summary

`CATEGORY_CONFIG_TO_GEOJSON` 内の3つのマッピングを修正。GeoJSON に存在しない値を参照していたエントリを、`ROOM_CATEGORIES`（`filter.ts`）で定義された正しい値に変更した。

## Changes

### 1. `structure: ["structure"]` → 削除＋コメント追加

- `"structure"` は `ROOM_CATEGORIES` に存在しない
- 構造体要素は `concrete` として GeoJSON に含まれるが、これは既に `EXCLUDED_CATEGORIES` で除外済み
- → マッピング行を削除し、理由をコメントとして記載

### 2. `outdoor_space: ["outdoor_space"]` → `outdoor_space: ["outdoor_practice"]`

- `"outdoor_space"` は `ROOM_CATEGORIES` に存在しない
- `ROOM_CATEGORIES` には `outdoorPractice: "outdoor_practice"` が存在
- → マッピング値を修正

### 3. `atrium: ["atrium"]` → `atrium: ["open_to_below"]`

- `"atrium"` は `ROOM_CATEGORIES` に存在しない
- `ROOM_CATEGORIES` には `openToBelow: "open_to_below"` が存在
- BaseView でも `open_to_below` がアトリウムのベースレイヤとして使用されている
- → マッピング値を修正

## Verification

- `filter.ts` の `ROOM_CATEGORIES` を確認し、すべての値が存在することを確認
- `npx tsc --noEmit` で型チェック → 今回の変更に起因するエラーなし（既存エラー2件のみ）
- 変更ファイル: `categoryDisplayConfig.ts` のみ

## Files Changed

| File | Change |
|------|--------|
| `mobile/src/features/home/map/config/categoryDisplayConfig.ts` | 3件のマッピング修正 |
