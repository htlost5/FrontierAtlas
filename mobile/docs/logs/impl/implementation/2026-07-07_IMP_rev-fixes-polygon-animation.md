---
agent: IMP
task_id: TASK-REV-FIXES-001
date: 2026-07-07
status: draft
category: log
destination: logs/impl/implementation/
tags:
  - IMP
  - bugfix
  - refactoring
---

# Implementation Log — REV指摘事項の修正

## 修正内容

### CRITICAL-1: PolygonLayer lineOpacity 誤参照
- **ファイル**: `src/features/home/map/components/mapComp/PolygonLayer/index.tsx`
- **内容**: `finalLineStyle.lineOpacity` が `fillStyle.fillOpacity` を参照していたバグを修正
- **修正前**: `fillStyle.fillOpacity ?? 1`
- **修正後**: `lineStyle.lineOpacity ?? fillStyle.fillOpacity ?? 1`

### WARNING-1: マジックナンバーの定数化
- **ファイル**: `src/features/home/map/constants/mapConfig.ts` — `animation.duration` セクションを追加
  ```ts
  animation: {
    duration: {
      flyTo: 750,
      cameraInit: 1000,
      zoomBound: 250,
    },
  },
  ```
- **ファイル**: `src/features/home/map/components/controls/userLocation.tsx` — `750` → `mapConfig.animation.duration.flyTo`
- **ファイル**: `src/features/home/map/hooks/camera/useMapCamera.ts` — `1000` → `mapConfig.animation.duration.cameraInit`
- **ファイル**: `src/features/home/map/hooks/camera/useCameraController/zoomBound.ts` — `250` → `mapConfig.animation.duration.zoomBound`

### WARNING-3: コメントアウトコード削除
- **ファイル**: `src/features/home/map/MapScreen.tsx`
- **内容**: L47-52 のコメントアウトされた `useCameraController` / `handleRegionDidChange` を TODO コメントに置換

### WARNING-2: any 型の改善（スキップ）
- MapLibre 型システムの制約のため現状維持

## 検証結果
- `npx tsc --noEmit` ✅ エラー0件
- 修正ファイル数: 5
