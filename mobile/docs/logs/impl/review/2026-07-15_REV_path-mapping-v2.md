---
agent: REV
task_id: TASK-pathmapping-001
date: 2026-07-15
status: draft
category: log
destination: mobile/docs/logs/impl/review/
related:
  - "[DD-path-mapping-v2](../../../../tools/map-assets/docs/shared/impl/decisions/design/DD-path-mapping-v2.md)"
  - "[REQ-geojson-redesign](../../shared/impl/specs/requirements/REQ-geojson-redesign.md)"
tags:
  - REV
  - review
  - TASK-pathmapping-001
  - path-mapping
---

# Review Log: Path Mapping v2 Implementation

## Review Result

**判定: ❌ CRITICAL — 差し戻し**

| File | Verdict |
|------|---------|
| `tools/map-assets/transformer/transform.js` | ✅ 承認 |
| `tools/map-assets/QGIS/scripts/allExports1.py` | ❌ CRITICAL |

---

## 1. transform.js — mapOutputPath()

### 1.1 定数定義

| 定数 | 状態 | 備考 |
|------|------|------|
| `BUILDING_LEVEL_OUTPUT` | ✅ | `{surface: 'surface.json', stairs: 'stairs.json'}` — DD 3.1 準拠 |
| `FLOOR_LEVEL_OUTPUT` | ✅ | `{rooms: 'rooms', surface: 'surface', walkable: 'walkable'}` — DD 3.1 準拠 |

### 1.2 判定ロジック（決定表 DD 3.2）

| 条件 | 出力 | 結果 |
|------|------|------|
| `parts.length===3 && parts[1]==='levels'` | `{root}/levels/{name}.json` | ✅ |
| `parts.length===3 && parts[1]==='building'` | `BUILDING_LEVEL_OUTPUT` 経由 → `{root}/{outputName}.json` | ✅ |
| `parts.length===3 && else` (floor-level) | `FLOOR_LEVEL_OUTPUT` 経由 → `{root}/{dir}/{floor}.json` | ✅ |
| `root not in [studyhall, interact]` | `null` (SKIP) | ✅ |

### 1.3 footprint 廃止対応（DD 5）

- `FOOTPRINT_OUTPUT_NAME` 定数: ✅ 完全削除済み
- `footprint`/`foorprint` 分岐: ✅ 完全削除済み
- `cleanOutputRoot()` による自動削除: ✅ 既存ロジックで対応

### 1.4 コードスタイル

- ✅ 定数オブジェクトでマジックネーム排除
- ✅ コメントとセクション区切りが適切
- ✅ エラーハンドリング: 未知パターンは `null` 返却

---

## 2. allExports1.py — map_output_path()

### 2.1 定数定義

| 定数 | 状態 | 備考 |
|------|------|------|
| `BUILDING_LEVEL_NAMES` | ✅ | `{"surface", "stairs"}` — DD 3.1 準拠 |
| `FLOOR_LEVEL_NAMES` | ✅ | `{"rooms", "surface", "walkable"}` — DD 3.1 準拠 |

### 2.2 ❌ CRITICAL: building-level 出力に `building/` 欠落

**箇所**: `map_output_path()` 関数、`parts[1] == "building"` ブロック（約15行目）

**現コード**:
```python
if parts[1] == "building":
    base_name = os.path.splitext(parts[2])[0]
    if base_name in BUILDING_LEVEL_NAMES:
        return os.path.join(OUTPUT_ROOT, root, filename)
```

**問題**:
- `os.path.join(OUTPUT_ROOT, root, filename)` → `{OUTPUT_ROOT}/{root}/stairs.geojson`
- 設計書 DD 2.2 では `{root}/building/stairs.geojson` が正しい出力
- `"building"` ディレクトリがパスから欠落している

**影響チェーン**:
1. `allExports1.py` → `exports/build/{root}/stairs.geojson`（`building/` なし）
2. → `transform.js walk()` が検出 → `parts = [root, stairs.geojson]` → `parts.length === 2`
3. → `mapOutputPath()` は `parts.length === 3` のみ処理 → `return null` (SKIP)
4. → `build/imdf/{root}/stairs.json` が**生成されない**

**修正案**:
```python
if parts[1] == "building":
    base_name = os.path.splitext(parts[2])[0]
    if base_name in BUILDING_LEVEL_NAMES:
        return os.path.join(OUTPUT_ROOT, root, "building", filename)
```

### 2.3 floor-level 出力 — 確認結果

`{root}/{floor}/rooms.gpkg` → `{OUTPUT_ROOT}/{root}/{floor}/rooms.geojson` ✅

`os.path.join(OUTPUT_ROOT, root, parts[1], filename)` — `parts[1]` が floor 名（`1F` 等）として正しく使われている。

### 2.4 levels/ — 変更なし

`{root}/levels/{name}.gpkg` → `{OUTPUT_ROOT}/{root}/levels/{name}.geojson` ✅

### 2.5 overview_map — SKIP 確認

`len(parts) == 1 and top_name == "overview_map"` → 直下出力 ✅

---

## 3. 新旧マッピング対照表との一致確認

### transform.js

| DD 表記: 新入力 → 新出力 | コード結果 | 判定 |
|---|---|---|
| `{root}/building/surface.geojson` → `{root}/surface.json` | ✅ `BUILDING_LEVEL_OUTPUT['surface']` = `'surface.json'` | ✅ |
| `{root}/building/stairs.geojson` → `{root}/stairs.json` | ✅ `BUILDING_LEVEL_OUTPUT['stairs']` = `'stairs.json'` | ✅ |
| `{root}/{floor}/rooms.geojson` → `{root}/rooms/{floor}.json` | ✅ `FLOOR_LEVEL_OUTPUT['rooms']` = `'rooms'` | ✅ |
| `{root}/{floor}/surface.geojson` → `{root}/surface/{floor}.json` | ✅ `FLOOR_LEVEL_OUTPUT['surface']` = `'surface'` | ✅ |
| `{root}/{floor}/walkable.geojson` → `{root}/walkable/{floor}.json` | ✅ `FLOOR_LEVEL_OUTPUT['walkable']` = `'walkable'` | ✅ |
| `{root}/levels/{name}.geojson` → `{root}/levels/{name}.json` | ✅ 変更なし | ✅ |

### allExports1.py

| DD 表記: 新入力 → 新出力 | コード結果 | 判定 |
|---|---|---|
| `{root}/building/surface.gpkg` → `{root}/building/surface.geojson` | ❌ `{root}/surface.geojson` (`building/` 欠落) | ❌ |
| `{root}/building/stairs.gpkg` → `{root}/building/stairs.geojson` | ❌ `{root}/stairs.geojson` (`building/` 欠落) | ❌ |
| `{root}/{floor}/rooms.gpkg` → `{root}/{floor}/rooms.geojson` | ✅ | ✅ |
| `{root}/{floor}/surface.gpkg` → `{root}/{floor}/surface.geojson` | ✅ | ✅ |
| `{root}/{floor}/walkable.gpkg` → `{root}/{floor}/walkable.geojson` | ✅ | ✅ |
| `{root}/levels/{name}.gpkg` → `{root}/levels/{name}.geojson` | ✅ 変更なし | ✅ |

---

## 4. Findings

1. **allExports1.py の building-level 出力パスバグ**: `os.path.join(OUTPUT_ROOT, root, "building", filename)` とすべきところが `os.path.join(OUTPUT_ROOT, root, filename)` になっている。`building/` ディレクトリが欠落。
2. **floor-level 出力は正しい**: `os.path.join(OUTPUT_ROOT, root, parts[1], filename)` で `parts[1]` が floor 名として機能。
3. **transform.js は完全に正しい**: 定数定義・判定ロジック・footprint 削除いずれも設計書に準拠。
4. **チェーン依存**: allExports1.py のバグは downstream の transform.js にも影響する（parts.length === 2 で SKIP）。

---

## 5. 差し戻し指示

IMP は以下の修正を行うこと：

1. `allExports1.py` の `map_output_path()` 内、`parts[1] == "building"` ブロックの `return` 行で `"building"` をパスに追加する
2. 修正後、本ファイルのパスを引き継いで REV に再依頼

---
