---
agent: IMP
task_id: TASK-pathmapping-001
date: 2026-07-15
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[DD-path-mapping-v2](../../shared/impl/decisions/design/DD-path-mapping-v2.md)"
tags:
  - IMP
  - implementation
  - TASK-pathmapping-001
---

# Implementation Log: Path Mapping v2 (exports/build Structure Change)

## Summary

`DD-path-mapping-v2` に基づき、`exports/build` の新ファイル構造に対応するパスマッピングロジックを2ファイルに実装した。

### 変更ファイル

#### 1. `tools/map-assets/transformer/transform.js`

**定数変更:**
- `FOOTPRINT_OUTPUT_NAME` → 削除
- `BUILDING_LEVEL_OUTPUT` → 追加（`surface`, `stairs` の出力ファイル名マップ）
- `FLOOR_LEVEL_OUTPUT` → 追加（`rooms`, `surface`, `walkable` の出力ディレクトリ名マップ）

**`mapOutputPath()` 変更:**
- `footprint`/`foorprint` 分岐 → 削除
- `stairs` root直下分岐 → 削除（`building/stairs` として統合）
- `floors/floorN/units` / `floors/floorN/section` 分岐 → 削除
- 新しい3分岐ロジック:
  - `parts.length === 3 && parts[1] === 'levels'` → 従来通り levels 出力
  - `parts.length === 3 && parts[1] === 'building'` → `BUILDING_LEVEL_OUTPUT` 参照
  - `parts.length === 3 && その他` → `FLOOR_LEVEL_OUTPUT` 参照（floor名で出力）

#### 2. `tools/map-assets/QGIS/scripts/allExports1.py`

**定数追加:**
- `BUILDING_LEVEL_NAMES = {"surface", "stairs"}`
- `FLOOR_LEVEL_NAMES = {"rooms", "surface", "walkable"}`

**`map_output_path()` 変更:**
- `len(parts)==2` ブロック（旧 footprint/stairs） → 削除
- `len(parts)==4 && parts[1]=='floors'` ブロック → 削除
- 新しい `len(parts)==3` ブロック:
  - `parts[1] == "levels"` → 従来通り
  - `parts[1] == "building"` → `BUILDING_LEVEL_NAMES` 判定
  - それ以外 → `FLOOR_LEVEL_NAMES` 判定

## マッピング網羅性確認

### transform.js

| 新入力パス | 出力パス | 結果 |
|---|---|---|
| `{root}/building/surface.geojson` | `{root}/surface.json` | ✅ |
| `{root}/building/stairs.geojson` | `{root}/stairs.json` | ✅ |
| `{root}/1F/rooms.geojson` | `{root}/rooms/1F.json` | ✅ |
| `{root}/1F/surface.geojson` | `{root}/surface/1F.json` | ✅ |
| `{root}/1F/walkable.geojson` | `{root}/walkable/1F.json` | ✅ |
| `{root}/levels/name.geojson` | `{root}/levels/name.json` | ✅ |
| `overview_map.geojson` | SKIP (null) | ✅ |
| `*.qmd` | SKIP (null) | ✅ |
| 不明なファイル | SKIP (null) | ✅ |

### allExports1.py

| 新入力パス | 出力パス | 結果 |
|---|---|---|
| `{root}/building/surface.gpkg` | `{root}/building/surface.geojson` | ✅ |
| `{root}/building/stairs.gpkg` | `{root}/building/stairs.geojson` | ✅ |
| `{root}/1F/rooms.gpkg` | `{root}/1F/rooms.geojson` | ✅ |
| `{root}/1F/surface.gpkg` | `{root}/1F/surface.geojson` | ✅ |
| `{root}/1F/walkable.gpkg` | `{root}/1F/walkable.geojson` | ✅ |
| `{root}/levels/name.gpkg` | `{root}/levels/name.geojson` | ✅ |
| `overview_map.gpkg` | `overview_map.geojson` | ✅ |
| 不明なファイル | SKIP (null) | ✅ |

## 自己チェック結果

1. **transform.js: `walk()` の互換性** ✅
   - `walk()` は `.geojson` ファイルを再帰的に走査し `mapOutputPath()` を呼ぶのみ。新構造（`building/`, `1F/`, `B1F/` 等の1階層下）でも正しく動作する

2. **allExports1.py: `os.walk` + `map_output_path` の互換性** ✅
   - `os.walk` で取得した `.gpkg` パスを `map_output_path()` に渡す。新構造（`building/`, `1F/` 等）のパスでも正しくマッピングされる

3. **コードスタイル一貫性** ✅
   - transform.js: 既存の `camelCase` 命名・コメントスタイルに準拠
   - allExports1.py: 既存の `snake_case` 命名・コメントスタイルに準拠

## 修正履歴

### 2026-07-15: Fix — building-level 出力パスに `building/` ディレクトリ欠落

**Issue**: REV レビューで `allExports1.py` の `map_output_path()` 内、`parts[1] == "building"` 分岐で出力パスに `"building"` ディレクトリが欠落していることが判明。

**原因**: `os.path.join(OUTPUT_ROOT, root, filename)` — 第3引数に `"building"` が欠けていた。

**修正**: `os.path.join(OUTPUT_ROOT, root, "building", filename)` に変更。

**影響範囲**:
- 修正前: `{OUTPUT_ROOT}/studyhall/stairs.geojson`（building/ なし）
- 修正後: `{OUTPUT_ROOT}/studyhall/building/stairs.geojson`（building/ あり）
- transform.js の `parts.length === 3` 判定を通過できるようになる

**関連ハンドオフ**: `2026-07-15_HANDOFF_IMP_REV_TASK-pathmapping-001.md`

## Open Questions

- `exports/build/` のファイル構造変更が既に適用済みであること。QGIS スクリプト側の GPKG 入力構造も対応済みであること。（どちらも前提条件）
- モバイルアプリ側の `footprint.json` → `surface.json` 読替は別タスク。
