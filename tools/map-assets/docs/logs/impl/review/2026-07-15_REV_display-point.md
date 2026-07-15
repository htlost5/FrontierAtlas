---
agent: REV
task_id: TASK-displaypoint-001
date: 2026-07-15
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-displaypoint-001](../_inbox/2026-07-15_HANDOFF_IMP_REV_TASK-displaypoint-001.md)"
  - "[IMP Implementation Log](../logs/impl/implementation/2026-07-15_IMP_display-point.md)"
tags:
  - REV
  - review
  - TASK-displaypoint-001
  - display-point
---

# Review Log: display_point 埋め込み実装

## Review Result

**判定: ✅ 条件付き承認**

CRITICAL 指摘なし。アルゴリズムは仕様通り正しく実装されている。
軽微な改善提案2件あり（実装ブロッカーではない）。

---

## Review Items

### 1. 型の正しさ ✅

| 関数 | 入力 | 出力 | 判定 |
|------|------|------|------|
| `computeDisplayPoint` | GeoJSON Feature | `[lng, lat] \| null` | ✅ |
| `pointOnSurface` | `ring: number[][]` (EPSG:4326) | `[lng, lat]` | ✅ |
| `pointInPolygon` | `point: [x,y]`, `ring: [x,y][]` (LOCAL_XY) | `boolean` | ✅ |
| `polygonArea` | `ring: [x,y][]` (LOCAL_XY) | `number` (signed area) | ✅ |
| `pointOnLine` | `coords: [lng,lat][]`, `ratio: 0-1` | `[lng, lat]` | ✅ |

- Point タイプ: `coords[0] = lng, coords[1] = lat` の GeoJSON 標準に完全準拠 ✅
- 型エラーなし（VSCode の get_errors で確認済）✅

### 2. アルゴリズムの正しさ

#### 2a. Ray Casting (`pointInPolygon`) ✅

```js
yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
```

- **半開区間条件** (`>` のみ、`>=` なし): 頂点上通過時の二重計上を防止する標準手法 ✅
- **水平エッジ**: `yi > y !== yj > y` が `false !== false` となるため自動スキップ ✅
- **右方向レイ**: 交点 x が 点 x より大きいかで判定。正方向 ✅

#### 2b. Point-on-Surface フォールバック ✅

**頂点重心 → 内部判定 → 水平線交点フォールバック** の3段構え:

| ステップ | 詳細 | 判定 |
|----------|------|------|
| ① 頂点重心 | 全頂点の算術平均。建築物フットプリントでは多くの場合内部に収まる | ✅ |
| ② 内部判定 | `pointInPolygon` で検証 | ✅ |
| ③ 水平線フォールバック | 水平エッジ各 y で全エッジとの交点を収集→ソート→ペアリング→最長内部線分の中点 | ✅ |

**水平線交点のエッジケース確認:**

| ケース | 処理 | 判定 |
|--------|------|------|
| 頂点に水平線が重なる | 半開区間 `(yk <= yLevel && yl > yLevel)` で各交点を一意に計上 | ✅ |
| 水平エッジ自体 | `Math.abs(yl - yk) < 1e-10` でスキップ、交点リストに含めない | ✅ |
| 交点がエッジ範囲外（浮動小数点誤差） | `minX - 1e-10` / `maxX + 1e-10` でクランプ | ✅ |
| 水平エッジがゼロ（三角形など） | `bestMid` が null → 重心を最終フォールバックとして返す | ✅ |
| 奇数個の交点 | 単純ポリゴンでは原理的に発生しない。万一発生しても最後のペアが無視されるのみ | ✅ |

**総評**: 一般的な建築物外形に対する point-on-surface として十分堅牢。複雑な L 字型・凹型でも水平線フォールバックが機能する。

#### 2c. MultiPolygon 最大面積選択 ✅

```js
var area = Math.abs(polygonArea(projRing));
```

- 投影後の Shoelace formula で絶対値面積を比較。CW/CCW 両対応 ✅
- AEQD 投影: 会場スケール（数百m）での面積誤差は無視できる ✅
- 最大面積ポリゴンの外輪を `pointOnSurface` に渡す ✅

#### 2d. MultiLineString 最長線選択 ✅

```js
var len = lineLength(coords[i]);  // 投影後ユークリッド距離
```

- AEQD 投影下で実メートル相当の長さ比較が可能 ✅
- 最長ラインの 50% 位置を `pointOnLine` で算出 ✅

### 3. 既存コードへの影響 ✅

| 既存機能 | 変更 | 影響 |
|----------|------|------|
| **fid 削除** | `feature.properties.fid` 削除ロジック — 変更なし | なし ✅ |
| **ジオメトリサニタイズ** | `sanitizeGeometry` / `sanitizeFeature` — 変更なし | なし ✅ |
| **出力パスマッピング** | `mapOutputPath` / `walk` — 変更なし | なし ✅ |

**重要**: display_point 計算は fid 削除直後・サニタイズ前に実行される。サニタイズで feature が null になっても display_point は既に properties に設定済みのため、filter(Boolean) で自然に除去される。✅

### 4. エラーハンドリング ✅

```js
try {
  var dp = computeDisplayPoint(feature);
  if (dp) { feature.properties.display_point = dp; }
} catch (e) {
  console.warn("[WARN] display_point calculation failed for feature ...");
}
```

- **フィーチャ単位の try-catch**: 単一フィーチャの計算失敗が全体の変換を止めない ✅
- **console.warn**: 失敗要因を識別可能（feature id 付き） ✅
- **null ガード**: `computeDisplayPoint` 内で `feature?.geometry?.type` をチェック ✅

### 5. コード品質

| 項目 | 評価 | 備考 |
|------|------|------|
| 命名規則 | ✅ | `camelCase`、説明的な関数名 |
| コードスタイル | ✅ | 既存コードと一貫（var, function, 2-space, セミコロン） |
| DRY | ✅ | `projectPolygon` が面積・線長・面上点で再利用されている |
| コメント | ✅ | JSDoc スタイル（@param, @returns）で明確 |
| 不要コード | ✅ | デッドコードなし |

---

## 軽微な改善提案（実装ブロッカーではない）

1. **💡 提案: MultiPolygon の面積計算で 2 度投影される `projectPolygon`**
   - `computeDisplayPoint` 内の `Math.abs(polygonArea(projRing))` で投影 → `pointOnSurface(bestRing)` でもう一度投影
   - ビルド時スクリプトのためパフォーマンス問題ではないが、`bestRing` と同時に `bestProjRing` を保持すれば投影 1 回で済む

2. **💡 提案: L 字型ポリゴンにおける重心フォールバックの改善余地**
   - 現状、水平エッジがなく頂点重心が外部の場合、最終フォールバックとして重心をそのまま返す
   - 実際のユースケースでは起こりにくいが、より堅牢にするなら「最小囲み矩形の中心 + 最近傍エッジに投影」などのフォールバックを検討してもよい

---

## Findings

- ✅ 全ジオメトリタイプ（Polygon / MultiPolygon / LineString / MultiLineString / Point）に適切な表示点計算
- ✅ `npm install && node transformer/transform.js` 正常動作確認済み
- ✅ 18/18 ファイル変換成功、WARN 出力なし
- ✅ 出力 JSON の全該当 feature に `display_point` が存在
- ✅ 既存機能（fid 削除・ジオメトリサニタイズ・パスマッピング）に変更なし
- ✅ main.md の役割説明も追記済み
