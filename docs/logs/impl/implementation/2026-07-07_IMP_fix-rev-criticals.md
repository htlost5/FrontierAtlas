---
agent: IMP
task_id: TASK-REV-CRITICALS
date: 2026-07-07
status: draft
category: log
destination: logs/impl/implementation/
tags:
  - IMP
  - rev-fixes
  - MapIconLabel
---

# REV指摘 CRITICAL 2件の修正

## 概要

REV（Reviewer）から指摘されたCRITICAL課題2件を修正した。

## 修正内容

### C1: MapIconLabel.tsx の `display` prop 未使用

- **原因**: Props に `display` が定義されているが、コンポーネント内で一切使用されていなかった（過去の実装の名残）
- **対応**:
  - `MapIconLabel.tsx`: Props 型定義から `display` を削除、関数引数からも削除
  - `MapScreen.tsx`: `MapIconLabel` 呼び出しから `display` prop を削除

### C2: ShapeSource に元データ data を渡しているバグ

- **原因**: L37 で `display_point` 変換後の `processedGeoJson` を作成しているにも関わらず、L44 の `ShapeSource` には変換前の元 `data` を渡していた。そのためラベルが `display_point`（部屋の中心座標）ではなく元の geometry に描画されていた
- **対応**: `shape={data}` → `shape={processedGeoJson}` に修正

## 変更ファイル

| ファイル | 変更内容 |
|----------|----------|
| `src/features/home/map/renderers/MapIconLabel.tsx` | Props から `display` 削除、`ShapeSource.shape` を `data`→`processedGeoJson` に修正 |
| `src/features/home/map/MapScreen.tsx` | `MapIconLabel` 呼び出しから `display` prop 削除 |

## 確認結果

- `npx tsc --noEmit` 合格（型エラーなし）
