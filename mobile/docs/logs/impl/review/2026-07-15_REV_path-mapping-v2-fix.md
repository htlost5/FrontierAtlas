---
agent: REV
task_id: TASK-pathmapping-001
date: 2026-07-15
status: approved
category: log
destination: mobile/docs/logs/impl/review/
related:
  - "[2026-07-15_REV_path-mapping-v2.md](./2026-07-15_REV_path-mapping-v2.md)"
  - "[TASK-pathmapping-001](../../shared/tasks/active/TASK-pathmapping-001_path-mapping-feature.md)"
tags:
  - REV
  - review
  - TASK-pathmapping-001
  - path-mapping
  - re-review
---

# Review Log: Path Mapping v2 — CRITICAL Fix Re-review

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘（building-level 出力パスに `"building"` 欠落）は修正済み。両ファイル間のパスマッピング整合性も確認済み。

---

## 1. 修正確認 — allExports1.py L122-126

| 項目 | 修正前 | 修正後 | 判定 |
|------|--------|--------|------|
| パス | `os.path.join(OUTPUT_ROOT, root, filename)` | `os.path.join(OUTPUT_ROOT, root, "building", filename)` | ✅ |
| 成分数 | 3 成分（.../root/filename） | 4 成分（.../root/building/filename） | ✅ |
| DD 2.2 準拠 | ❌ `{root}/surface.geojson` | ✅ `{root}/building/surface.geojson` | ✅ |

---

## 2. 両ファイル間のパスマッピング整合性

### building-level チェーン

```
allExports1.py 出力:  {OUTPUT_ROOT}/{root}/building/surface.geojson
                                ↓  (INPUT_BUILD == OUTPUT_ROOT)
transform.js 入力:     {INPUT_BUILD}/{root}/building/surface.geojson
                                ↓  (parts=[root,building,surface.geojson], length=3, parts[1]==='building')
transform.js 出力:     {OUTPUT_ROOT}/{root}/surface.json
```

| 要素 | allExports1.py | transform.js | 整合 |
|------|----------------|--------------|------|
| 入力パス構造 | `{root}/building/{name}.gpkg` | `{root}/building/{name}.geojson` | ✅ |
| 中間ディレクトリ `building/` | ✅ 出力先に含む | ✅ 入力として期待 (`parts[1]==='building'`) | ✅ |
| ファイル名解決 | `BUILDING_LEVEL_NAMES` で検査 | `BUILDING_LEVEL_OUTPUT` でマッピング | ✅ |
| 出力先 | `{root}/building/{name}.geojson` | `{root}/{surface\|stairs}.json` | ✅（JS 側は building/ 除去が正しい動作） |

### floor-level チェーン（変更なし・再確認）

```
allExports1.py:  {OUTPUT_ROOT}/{root}/1F/rooms.geojson  ← parts[1] = "1F" (floor名)
transform.js:    {OUTPUT_ROOT}/{root}/rooms/1F.json       ← dir = "rooms", floorName = "1F"
```

✅ 一貫性あり。

### levels/ チェーン（変更なし）

```
allExports1.py:  {OUTPUT_ROOT}/{root}/levels/{name}.geojson
transform.js:    {OUTPUT_ROOT}/{root}/levels/{name}.json
```

✅ 一貫性あり。

---

## 3. 新旧マッピング対照表 — 全件一致確認

### allExports1.py

| DD 表記: 入力 → 出力 | コード結果 | 判定 |
|---|---|---|
| `{root}/building/surface.gpkg` → `{root}/building/surface.geojson` | ✅ `{root}/building/surface.geojson` | ✅ **FIXED** |
| `{root}/building/stairs.gpkg` → `{root}/building/stairs.geojson` | ✅ `{root}/building/stairs.geojson` | ✅ **FIXED** |
| `{root}/{floor}/rooms.gpkg` → `{root}/{floor}/rooms.geojson` | ✅ | ✅ |
| `{root}/{floor}/surface.gpkg` → `{root}/{floor}/surface.geojson` | ✅ | ✅ |
| `{root}/{floor}/walkable.gpkg` → `{root}/{floor}/walkable.geojson` | ✅ | ✅ |
| `{root}/levels/{name}.gpkg` → `{root}/levels/{name}.geojson` | ✅ | ✅ |

### transform.js

| DD 表記: 入力 → 出力 | コード結果 | 判定 |
|---|---|---|
| `{root}/building/surface.geojson` → `{root}/surface.json` | ✅ | ✅ |
| `{root}/building/stairs.geojson` → `{root}/stairs.json` | ✅ | ✅ |
| `{root}/{floor}/rooms.geojson` → `{root}/rooms/{floor}.json` | ✅ | ✅ |
| `{root}/{floor}/surface.geojson` → `{root}/surface/{floor}.json` | ✅ | ✅ |
| `{root}/{floor}/walkable.geojson` → `{root}/walkable/{floor}.json` | ✅ | ✅ |
| `{root}/levels/{name}.geojson` → `{root}/levels/{name}.json` | ✅ | ✅ |

---

## 4. その他確認事項

- **overview_map**: 変更なし、直下出力のまま ✅
- **footprint 廃止**: 両ファイルとも footprint 関連コードは完全削除済み ✅
- **SKIP 判定**: 未知パターンはいずれも `None` / `null` 返却 ✅
- **型・構文エラー**: なし（get_errors で確認済）✅

---

## 5. Findings

1. **修正は完全** — 前回 CRITICAL 指摘の `"building"` ディレクトリ欠落が正しく修正された
2. **全 6 パターンのマッピング**が両ファイル間で完全一致
3. **チェーン依存が解消** — allExports1.py の出力（`{root}/building/{name}.geojson`）が transform.js の入力条件（`parts.length===3 && parts[1]==='building'`）を満たす
4. **他に問題なし** — 他セクション（floor-level, levels, overview_map）は変更なしで正常

---

## 6. ハンドオフ

```yaml
status: approved
confidence: high
artifacts:
  - mobile/docs/logs/impl/review/2026-07-15_REV_path-mapping-v2-fix.md
  - tools/map-assets/QGIS/scripts/allExports1.py (fixed)
  - tools/map-assets/transformer/transform.js (unchanged)
open_questions: []
routing:
  next: TST
  action: テスト実行を依頼
```

**→ TST へ引き継ぎ: テスト実行を依頼する。**
