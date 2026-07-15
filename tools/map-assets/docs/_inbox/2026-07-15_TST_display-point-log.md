---
agent: TST
task_id: TASK-displaypoint-001
date: 2026-07-15
status: pending
category: log
destination: docs/logs/impl/testing/
related:
  - "[TASK-displaypoint-001](../shared/tasks/active/TASK-displaypoint-001.md)"
  - "[REV Review Log](../logs/impl/review/2026-07-15_REV_display-point.md)"
tags:
  - TST
  - testing
  - TASK-displaypoint-001
---

# Testing Log: display_point 埋め込み実装

## Test Result

**判定: ✅ 合格**

全7観点のテストを実施し、全て合格。

---

## Test Environment

| Item | Value |
|------|-------|
| Script | `tools/map-assets/transformer/transform.js` |
| CWD | `tools/map-assets` |
| Node.js | v24.15.0 |
| 入力ファイル | 18 GeoJSON (exports/build/) + base files |
| 出力先 | build/imdf/ |
| テスト日時 | 2026-07-15 |

---

## Test Results by Category

### 観点1: スクリプト正常終了 ✅

**コマンド**: `node transformer/transform.js`
- 終了コード: 0
- `[OK]` 18件、`[SKIP]` 1件（overview_map — 想定内）、`[DONE]` 出力あり
- `[WARN]` 出力なし
- 全ファイル正常変換

### 観点2: Polygon/MultiPolygon の display_point がポリゴン内部にある ✅

**サンプル**: studyhall rooms 3F から 20 フィーチャ抽出
- **結果**: 20/20 (100%) 内部に位置

**検証手法**: 独自の Ray Casting 点内包判定（transform.js の実装と同一アルゴリズム、LOCAL_XY 投影後に判定）

**追加サンプル**: interact rooms 1F から 10 フィーチャ
- **結果**: 10/10 (100%) 内部に位置

**追加サンプル**: studyhall surface (building-level, Polygon)
- **結果**: 内部に位置 ✅

### 観点3: LineString/MultiLineString の display_point が 50% 位置 ✅

**サンプル**: studyhall stairs から 10 フィーチャ抽出
- **結果**: 10/10 (100%) 50% 位置と一致（許容誤差: 0.0000001度 ≈ 0.01m）

**検証手法**: 同一アルゴリズムで50%位置を再計算し、display_point の値と比較

### 観点4: Point feature の display_point が元座標と一致 ✅

該当する Point フィーチャが今回のデータセットに存在しないため、コードレビューで確認:
- `computeDisplayPoint()` の `case "Point"` ブランチ: `return [coords[0], coords[1]]` — 元座標をそのまま返す実装 ✅

### 観点5: display_point が配列 `[lng, lat]` 形式 ✅

**全ファイルスキャン**: 24出力ファイル、493/494 フィーチャが正しい `[lng, lat]` 形式

**注記**: 1件の形式不一致は `venue/venue.json` の `display_point` が `{"type":"Point","coordinates":[lng,lat]}`（GeoJSON Point形式）。これは元データ `exports/base/venue/venue.json` からそのままコピーされた既存データであり、本実装の変換対象外。本件は既存仕様であり不合格理由ではない。

### 観点6: エラー発生時もスクリプトが中断せず継続 ✅

以下の破損データでテスト:
| ケース | 結果 |
|--------|------|
| `geometry.coordinates = null` | TypeError を try-catch で捕捉、console.warn 出力 |
| `geometry = null` | computeDisplayPoint が null を返す（graceful skip） |
| `geometry = undefined` | computeDisplayPoint が null を返す（graceful skip） |

全てのケースでスクリプト全体は中断せず、console.warn で id 付きログ出力後に継続。

### 観点7: 既存機能保全 ✅

以下の既存機能が正常動作していることを確認:

| 機能 | 検証方法 | 結果 |
|------|----------|------|
| fid 削除 | 全出力ファイルをスキャンし、fid/feature_id プロパティ不在を確認 | ✅ 全ファイルで削除済み |
| プロパティ id 維持 | 全フィーチャに `properties.id` が存在することを確認 | ✅ 全フィーチャ保持 |
| ジオメトリサニタイズ | 全出力ファイルの全リング/ラインに重複座標がないことを確認 | ✅ 重複なし |

---

## Summary

| # | 観点 | 結果 | 詳細 |
|---|------|------|------|
| 1 | スクリプト正常終了 | ✅ | 18/18 OK, 終了コード 0 |
| 2 | Polygon 内部性 | ✅ | 31/31 内部 (10+20+1) |
| 3 | LineString 50% 位置 | ✅ | 10/10 一致 |
| 4 | Point 一致性 | ✅ | コード確認済み |
| 5 | [lng,lat] 形式 | ✅ | 493/494 (1件は既存データ) |
| 6 | エラー継続 | ✅ | 全ケースで graceful handling |
| 7 | 既存機能保全 | ✅ | fid削除・id保持・サニタイズ全て正常 |

**総合判定: ✅ 合格**

ORC への引き継ぎ可能。
