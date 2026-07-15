---
agent: DWR
task_id: TASK-pathmapping-001
date: 2026-07-15
status: approved
category: shared
destination: tools/map-assets/docs/shared/specs/
related:
  - "[DD-path-mapping-v2](../impl/decisions/design/DD-path-mapping-v2.md)"
tags:
  - exports
  - build
  - structure
  - map-assets
---

# exports/build ファイル構造と責務

## 1. ディレクトリ構造

```
exports/build/
├── overview_map.geojson          ← 全体マップ（ルート直下、build/imdf には出力されない）
├── overview_map.qmd              ← QGIS スタイル定義
├── {root}/                       ← root ∈ {studyhall, interact}
│   ├── building/
│   │   ├── surface.geojson       ← 建物全体の外形（building-level）
│   │   ├── surface.qmd
│   │   ├── stairs.geojson        ← 階段（studyhall のみ）
│   │   └── stairs.qmd
│   ├── {floor}/                  ← floor ∈ {1F, 2F, 3F, 4F, 5F}
│   │   ├── rooms.geojson         ← 部屋の地物描画（元 units.geojson）
│   │   ├── rooms.qmd
│   │   ├── surface.geojson       ← フロア別の床面（floor-level）
│   │   ├── surface.qmd
│   │   ├── walkable.geojson      ← 通行可能な通路情報（元 sections.geojson）
│   │   └── walkable.qmd
│   └── levels/
│       └── {name}.geojson        ← レベル定義
```

## 2. 各ファイルの責務

| ファイル | 責務 | 描画 | 経路計算 | 備考 |
|----------|------|------|----------|------|
| **rooms.geojson** | 部屋の地物ポリゴン | ✅ メイン描画 | ❌ | 旧 units.geojson |
| **surface.geojson** (building-level) | 建物全体の外形（1つのポリゴン） | ✅ 背景床 | ❌ | 旧 footprint.geojson の代替 |
| **surface.geojson** (floor-level) | フロア別の床面ポリゴン | ✅ フロア床 | ❌ | **新規** |
| **walkable.geojson** | 通行可能な通路ポリゴン | ❌ | ✅（将来） | 旧 sections.geojson、経路探索に使用予定 |
| **stairs.geojson** | 階段ポリゴン | ✅ 階段表示 | ❌ | studyhall のみ |
| **levels/**.geojson | フロア定義（高さ・名称等） | ❌ | ❌ | メタデータ |

## 3. 名称変更マッピング

| 旧名称 | 新名称 | 変更理由 |
|--------|--------|----------|
| `units` | `rooms` | 部屋をより直感的に表現 |
| `sections` | `walkable` | 通路の用途を明確化 |
| `footprint` | `surface` (building-level) | 床データとの統合・責務明確化 |

## 4. パイプライン

```
QGIS (GPKG)
    ↓ allExports1.py
exports/build/ (GeoJSON)
    ↓ transform.js
build/imdf/ (JSON, fidi削除済)
    ↓ build-release.js (CI: git tag push)
releases/vX.X.X/ (配信用)
```

## 5. 注意点

- `walkable.geojson` は**描画に使用しない**。将来の経路計算・表示に利用予定。
- `building/surface.geojson` と `{floor}/surface.geojson` は**同一ファイル名で異なる責務**を持つ。`parts[1] === "building"` で区別する。
- `.qmd` ファイルは QGIS スタイル定義であり、transform しない。
- `overview_map.geojson` は `build/imdf` に出力されない（SKIP）。
