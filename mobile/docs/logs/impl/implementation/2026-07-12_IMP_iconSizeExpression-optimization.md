---
agent: IMP
task_id: TASK-iconSizeExpression-001
date: 2026-07-12
status: draft
category: log
destination: docs/logs/impl/implementation/
tags:
  - IMP
  - implementation
  - iconSizeExpression
  - zoom-optimization
---

# Implementation Log — iconSizeExpression ズーム範囲最適化

## Task
iconSizeExpression のズームレベル範囲を実際のマップズーム範囲（16.9〜20.7）に合わせて補正。
到達不能な zoom 21+ のストップを実現可能な範囲に修正し、指数 1.5 カーブで滑らかなサイズ変化を実現。

## Changes Made

### 1. `shareComp.tsx` — 通常カテゴリアイコン
**Before**:
```ts
iconSize: iconSizeExpression([
  [21, 0.35],
  [23, 0.45],
  [25, 0.55],
]),
```
**After**:
```ts
iconSize: iconSizeExpression([
  [17, 0.30],
  [18, 0.40],
  [19, 0.52],
  [20, 0.65],
]),
```
> zoom 17(最小)〜20(最大近辺) で明示的に指定。指数 1.5 カーブに沿った自然な加速。

### 2. `UnitSymbol.tsx` — 特殊シンボル（通常の 1.25〜1.27倍）
静的な `iconSize: 0.35` を zoom 対応の `iconSizeExpression` に変更。
**Before**: `iconSize: 0.35`
**After**:
```ts
iconSize: iconSizeExpression([
  [17, 0.38],
  [18, 0.50],
  [19, 0.65],
  [20, 0.81],
]),
```
> 通常比 1.25〜1.27倍。z=17: 0.38/0.30=1.27, z=20: 0.81/0.65=1.25

### 3. `MapSymbolIcon.tsx` — MapSymbolIcon
**Before**:
```ts
iconSize: iconSizeExpression([
  [17.9, iconSizeBase * 0.5],
  [21.1, iconSizeBase * 3.7],
]),
```
**After**:
```ts
iconSize: iconSizeExpression([
  [17, iconSizeBase * 0.5],
  [20, iconSizeBase * 3.7],
]),
```
> 到達不能な zoom 21.1 → zoom 20 に修正。iconSizeBase=0.03 デフォルト時: z=17:0.015, z=20:0.111

## Files Affected
- `mobile/src/features/home/map/renderers/labels/shareComp.tsx` — iconSize ストップ修正
- `mobile/src/features/home/map/renderers/UnitSymbol.tsx` — 静的サイズ → iconSizeExpression 化
- `mobile/src/features/home/map/renderers/symbols/MapSymbolIcon.tsx` — zoom 21.1 → 20 修正

## Verification
- 3ファイルとも TypeScript コンパイルエラーなし（`npx tsc --noEmit` 通過）
- lint エラーなし

## Handoff to REV
コードレビューを依頼する。
