---
agent: DEV
task_id: TASK-pathmapping-001
date: 2026-07-15
status: draft
category: shared
destination: tools/map-assets/docs/shared/impl/decisions/design/
related:
  - "[REQ-geojson-redesign](../../../mobile/docs/shared/impl/specs/requirements/REQ-geojson-redesign.md)"
tags:
  - DEV
  - design-decision
  - path-mapping
  - map-assets
---

# DD-path-mapping-v2: exports/build 新構造向けパスマッピング再設計

## 1. 背景

`tools/map-assets/exports/build` のファイル構造がフラットな階層（`floors/floorN/units.geojson`）から、責務別ファイル + building/floor 二層構造に変更された。これに伴い、`transformer/transform.js` の `mapOutputPath()` および `QGIS/scripts/allExports1.py` の `map_output_path()` のマッピングロジックを再設計する。

---

## 2. 新旧マッピング対照表

### 2.1 exports/build → build/imdf（transform.js）

| 旧入力パス | 旧出力パス | 新入力パス | 新出力パス | 備考 |
|---|---|---|---|---|
| `{root}/footprint.geojson` | `{root}/footprint.json` | **廃止** | **削除** | surface が代替 |
| `{root}/stairs.geojson` | `{root}/stairs.json` | `{root}/building/stairs.geojson` | `{root}/stairs.json` | 入力元が building/ 配下に移動 |
| `{root}/floors/{floor}/units.geojson` | `{root}/units/{floor}.json` | `{root}/{floor}/rooms.geojson` | `{root}/rooms/{floor}.json` | 名称変更: units→rooms |
| `{root}/floors/{floor}/section.geojson` | `{root}/sections/{floor}.json` | `{root}/{floor}/walkable.geojson` | `{root}/walkable/{floor}.json` | 名称変更: section→walkable |
| （存在せず） | — | `{root}/building/surface.geojson` | `{root}/surface.json` | **新規**: building-level surface |
| （存在せず） | — | `{root}/{floor}/surface.geojson` | `{root}/surface/{floor}.json` | **新規**: floor-level surface |
| `{root}/levels/{name}.geojson` | `{root}/levels/{name}.json` | 変更なし | 変更なし | — |
| `overview_map.geojson` | SKIP | 変更なし | SKIP | — |
| `*.qmd` | SKIP | 変更なし | SKIP | — |

### 2.2 QGIS GPKG → exports/build（allExports1.py）

| 旧入力パス | 旧出力パス | 新入力パス | 新出力パス | 備考 |
|---|---|---|---|---|
| `{root}/footprint.gpkg` | `{root}/footprint.geojson` | **廃止** | **削除** | surface が代替 |
| `{root}/stairs.gpkg` | `{root}/stairs.geojson` | `{root}/building/stairs.gpkg` | `{root}/building/stairs.geojson` | building/ 配下に移動 |
| `{root}/floors/{floor}/units.gpkg` | `{root}/floors/{floor}/units.geojson` | `{root}/{floor}/rooms.gpkg` | `{root}/{floor}/rooms.geojson` | 名称変更＋階層簡略化 |
| （存在せず） | — | `{root}/building/surface.gpkg` | `{root}/building/surface.geojson` | **新規** |
| （存在せず） | — | `{root}/{floor}/surface.gpkg` | `{root}/{floor}/surface.geojson` | **新規** |
| （存在せず） | — | `{root}/{floor}/walkable.gpkg` | `{root}/{floor}/walkable.geojson` | **新規** |
| `{root}/levels/{name}.gpkg` | `{root}/levels/{name}.geojson` | 変更なし | 変更なし | — |
| `overview_map.gpkg` | `overview_map.geojson` | 変更なし | 変更なし | — |

---

## 3. 新しい `mapOutputPath()` 論理設計

### 3.1 ファイル名定数

マジックネームを防ぐため、以下のマッピング定数を定義する：

```javascript
// transform.js
const BUILDING_LEVEL_OUTPUT = {
  surface: 'surface.json',   // building-level → root 直下
  stairs:  'stairs.json',    // stairs → root 直下
};

const FLOOR_LEVEL_OUTPUT = {
  rooms:    'rooms',          // → {root}/rooms/{floor}.json
  surface:  'surface',        // → {root}/surface/{floor}.json
  walkable: 'walkable',       // → {root}/walkable/{floor}.json
};
```

```python
# allExports1.py
BUILDING_LEVEL_NAMES = {"surface", "stairs"}
FLOOR_LEVEL_NAMES = {"rooms", "surface", "walkable"}
```

### 3.2 判定ロジック（決定表）

`parts` は入力パスを `path.sep` で分割した配列（root 相対）。

| parts.length | parts[1] | 解釈 | アクション |
|---|---|---|---|
| 1 | — | root 直下（overview_map 等） | SKIP（null 返却） |
| 2 | `"levels"` | levels ファイル | `{root}/levels/{fileName}.json` |
| 3 | `"building"` | building-level ファイル | `BUILDING_LEVEL_OUTPUT` 参照、`{root}/{outputName}` |
| 3 | その他（`"1F"`等） | floor-level ファイル | `FLOOR_LEVEL_OUTPUT` 参照、`{root}/{dir}/{floor}.json` |

---

## 4. `surface` の building-level / floor-level 分岐ロジック

### 4.1 判定基準

`surface.geojson` は同一ファイル名で2つの異なる出力先を持つ。**`parts` 配列の `parts[1]` の値で分岐する**：

| 条件 | parts[1] | 意味 | 出力パス |
|---|---|---|---|
| `{root}/building/surface.geojson` | `"building"` | 建物全体の外形 | `{root}/surface.json` |
| `{root}/1F/surface.geojson` | `"1F"`（数字+F） | フロア別の床面 | `{root}/surface/1F.json` |

### 4.2 設計根拠

- `parts[1]` が `"building"` リテラルか否かは曖昧性なく判定可能
- floor 名のバリエーション（`1F`, `B1F` 等）に依存しない
- 将来的に `building/` に新しいファイル種別が追加されても拡張容易

---

## 5. `footprint.geojson` 廃止の影響と対処

### 5.1 影響範囲

| 影響箇所 | 内容 |
|---|---|
| `transform.js` `mapOutputPath()` | `footprint`/`foorprint` の分岐を削除 |
| `transform.js` `FOOTPRINT_OUTPUT_NAME` 定数 | まるごと削除 |
| `build/imdf/{root}/footprint.json` | 出力されなくなる |
| モバイルアプリ側の読み込みコード | `footprint.json` を `surface.json` に読み替え必要（**別タスク**） |
| `allExports1.py` `map_output_path()` | `footprint.gpkg` 分岐を削除 |

### 5.2 対処手順

1. `transform.js` から `FOOTPRINT_OUTPUT_NAME` 定数と `footprint`/`foorprint` 分岐を削除
2. `allExports1.py` から `footprint.gpkg` 分岐を削除（`len(parts)==2` ブロックの footprint 条件）
3. モバイルアプリ側の `footprint.json` 参照を `surface.json` に変更（**本設計の範囲外、別途 DEV で設計**）
4. 既存の `build/imdf/{root}/footprint.json` は transformer 実行時の `cleanOutputRoot()` で自動削除される

### 5.3 `stairs` の扱い

`stairs` は **廃止しない**。入力元が `{root}/building/stairs.geojson` に変わるのみ。`building/` の判定ブロックに含める。

---

## 6. 拡張性の考慮

### 6.1 新しい root（venue）の追加

`TARGET_ROOTS`（JS では `['studyhall', 'interact']` のインライン配列、Python では `TARGET_ROOTS` set）に追加するのみで動作する。マッピングロジックは root 名に依存しない。

### 6.2 新しいファイル種別の追加

- **building-level**: `BUILDING_LEVEL_OUTPUT` にエントリ追加
- **floor-level**: `FLOOR_LEVEL_OUTPUT` にエントリ追加
- 新しい階層（例: `underground/`）: `parts[1]` のリテラル判定を追加

### 6.3 walkable 不在フロアの扱い

`walkable.geojson` が存在しないフロア（interact/1F, interact/3F 等）では、単に `walk()` がそのファイルを検出しないため、何も出力されない。`mapOutputPath()` 側で特別な対応は不要。

---

## 7. 決定事項

| # | 決定 | 根拠 |
|---|---|---|
| D1 | `footprint.geojson` のマッピングを完全削除 | surface が建物外形を代替するため |
| D2 | `surface` の分岐に `parts[1] === 'building'` リテラル判定を使用 | 曖昧性排除・拡張性 |
| D3 | ファイル名マッピングを定数オブジェクト化 | マジックネーム排除・保守性 |
| D4 | `stairs` は廃止せず、入力元を `building/stairs.geojson` に変更 | 階段データは依然必要 |
| D5 | `levels/` のマッピングは変更しない | 現行構造に変更なし |
| D6 | QGIS スクリプトの出力先を新 `exports/build/` 構造に合わせる | パイプライン一貫性確保 |

---

## 8. 未解決事項（Open Questions）

1. **QGIS の GPKG 入力構造**: 新 `exports/build/` 構造に対応する GPKG 入力が `D:\htlost5_projects\geo-data-repo\QGIS\working` に既に配置されているか未確認。配置済みであれば本設計通り、未配置であれば QGIS プロジェクト側のレイヤ構造変更が必要。
2. **モバイルアプリ側の `footprint.json` → `surface.json` 読替**: 本設計の範囲外。別途 DEV タスクとして切り出す。
3. **levels/ の生成元**: 現在 `exports/build/` に levels 用 `.geojson` が存在しない。別スクリプトで生成されている可能性があり、変更不要と判断したが要確認。
