---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-15
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK display_point](../_inbox/2026-07-15_HANDOFF_IMP_REV_TASK-displaypoint-001.md)"
tags:
  - IMP
  - implementation
  - TASK-displaypoint-001
---

# Implementation Log: GeoJSON→JSON変換に display_point 埋め込み機能を実装

## Summary

GeoJSON→JSON 変換スクリプト `transform.js` に、各フィーチャのシンボル表示用 `display_point` 座標を計算し `properties` に埋め込む機能を追加した。

## Changes

### 1. `tools/map-assets/package.json`
- `"proj4": "^2.20.9"` を dependencies に追加

### 2. `tools/map-assets/transformer/transform.js`

**追加行:**
- `const proj4 = require("proj4");` — 冒頭（fs, path 直後）
- `LOCAL_XY` 投影定義定数と `proj4.defs("LOCAL_XY", ...)` — Coordinate deduplication セクションの直前

**幾何計算ヘルパー関数（sanitizeFeature の前に追加）:**
- `projectPolygon(ring, forward)` — ポリゴン座標の投影/逆投影
- `polygonArea(ring)` — 符号付き面積（平面幾何、Shoelace formula）
- `pointInPolygon(point, ring)` — Ray Casting による内外判定
- `pointOnSurface(ring)` — 面上点計算（頂点平均→内部判定→水平線交点フォールバック）
- `lineLength(coords)` — 線長計算（投影座標系）
- `pointOnLine(coords, ratio)` — 線上の指定比率位置
- `computeDisplayPoint(feature)` — ジオメトリタイプ別呼び分け

**transformGeoJSONFile 関数内の変更:**
- fid 削除ループ内に display_point 計算を追加（try-catch でフィーチャ単位のエラーを捕捉）

### 3. `tools/map-assets/transformer/main.md`
- 役割説明に項目3を追記：「各featureに display_point 座標を算出して properties に埋め込む」

## ジオメトリタイプ別処理

| タイプ | display_point 計算方法 |
|---|---|
| Polygon | 外輪に point-on-surface（頂点平均→Ray Casting→水平線交点フォールバック） |
| MultiPolygon | 最大面積ポリゴンの外輪に point-on-surface |
| LineString | 線長の50%位置 |
| MultiLineString | 最長ラインの50%位置 |
| Point | その座標をそのまま [lng, lat] |
| その他 | null（スキップ） |

## 動作確認

- ✅ `npm install` — proj4 が正常にインストール済み
- ✅ `node transformer/transform.js` — 全ファイル変換成功、WARN 出力なし
- ✅ 出力 JSON の Polygon/MultiPolygon/LineString feature に `display_point` が存在
- ✅ エラーハンドリング — try-catch でフィーチャ単位の失敗を console.warn で捕捉

### 検証結果サンプル

```
studyhall/rooms/1F.json: 全 feature に display_point あり
  sample: [139.67795264160068, 35.498141263182745]
studyhall/surface/1F.json: 1/1 feature に display_point あり
  sample: [139.67831077929148, 35.49840686585234]
```
