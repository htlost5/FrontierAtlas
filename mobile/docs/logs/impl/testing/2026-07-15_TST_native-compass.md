---
agent: TST
task_id: TASK-compass-001
date: 2026-07-15
status: approved
category: log
destination: docs/logs/impl/testing/
related:
  - "[TASK-compass-001](../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - TST
  - testing
  - TASK-compass-001
---

# Testing Log: Stairs.geojson Floor-Level Filtering

## Result

**判定: ✅ 合格**

全テストケース合格。IMP への差し戻し不要。

---

## 1. 型チェック

### get_errors 結果

| ファイル | エラー数 | 判定 |
|---|---|---|
| `src/features/home/map/layers/stairs/filter.ts` | 0 | ✅ |
| `src/features/home/map/layers/stairs/index.tsx` | 0 | ✅ |
| `src/features/home/map/constants/colorPalette.ts` | 0 | ✅ |
| `src/features/home/map/MapScreen.tsx` | 0 | ✅ |

### tsc --noEmit 全体

既存エラー2件（階段機能と無関係）:
- `app.config.ts(30,5)`: jsEngine property
- `MapContainer.tsx(34,7)`: CameraRegion type

### expo lint 全体

既存エラー4件（階段機能と無関係）:
- `useBatchMapData.ts`: refs
- `rooms/index.tsx`: unused import
- `LabelConfigs.ts`: duplicate import
- `useTabAnimatedValues.ts`: ref access during render

対象4ファイルに lint エラーなし。

---

## 2. フィルタロジック検証

### buildStairsFilter() 全ケース

| currentFloor | 戻り値Expression | 意味 |
|---|---|---|
| 1 | `["!=", ["get", "category"], "4-5"]` | category="4-5" 除外 |
| 2 | `["!=", ["get", "category"], "4-5"]` | 同上 |
| 3 | `["!=", ["get", "category"], "4-5"]` | 同上 |
| 4 | `["literal", true]` | 全表示 |
| 5 | `["literal", true]` | 全表示 |

### 判定: ✅ 全ケース正しい

---

## 3. stairs.geojson category 分布

コマンド: `node -e "JSON.parse(fs.readFileSync('...stairs.geojson'))"`

| category 値 | 件数 |
|---|---|
| `null` | 57 |
| `"4-5"` | 28 |
| その他 | 0 |

全85 Feature。想定外のカテゴリ値なし。

### 判定: ✅ データ整合性問題なし

---

## 4. コンポーネント Props 検証

MapScreen.tsx → StairsLayer に渡される Props:

| Prop | 実引数 | 型 | 適合 |
|---|---|---|---|
| data | `batchData.stairs` | `FeatureCollection \| null` | ✅ |
| currentFloor | `batchData.currentFloor` | `number` | ✅ |
| palette | `colorTheme.stairs` | `StairsPalette` | ✅ |
| visible | `displayMode !== "building"` | `boolean` (default true) | ✅ |

### 判定: ✅ Props 完全一致

---

## 5. 受入条件

| # | 条件 | 結果 | 根拠 |
|---|---|---|---|
| 1F-3F | category=null のみ表示 | ✅ | `["!=", ["get", "category"], "4-5"]` |
| 4F | null + "4-5" 両方表示 | ✅ | `["literal", true]` |
| 5F | null + "4-5" 両方表示 | ✅ | `["literal", true]` |
| building モード | 階段非表示 | ✅ | `visible=false → lineOpacity: 0` |
| ダークテーマ | 色切替 | ✅ | LIGHT: #A09080, DARK: #8B7D6B |
| 描画順 | 階段→UnitSymbol→MapIconLabel | ✅ | レンダリング順序正しい |
| 型エラー | 0件 | ✅ | get_errors 0件 |

---

## Summary

```
status: 成功
key_findings: stairs.geojson 階層別フィルタリング機能、全テストケース合格
artifacts: なし（新規成果物なし）
open_questions: なし
next_actions: 合格 → ORC に返却。REL がリリース作業を継続可能
```
