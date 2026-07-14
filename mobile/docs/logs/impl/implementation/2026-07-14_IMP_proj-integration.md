---
agent: IMP
task_id: TASK-proj-001
date: 2026-07-14
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-proj-001](../shared/tasks/active/TASK-proj-001_proj-integration.md)"
  - "[boundsBound.ts](../../../src/features/home/map/hooks/camera/useCameraController/boundsBound.ts)"
  - "[crsDefinitions.ts](../../../src/utils/crsDefinitions.ts)"
  - "[coordinateTransform.ts](../../../src/utils/coordinateTransform.ts)"
tags:
  - IMP
  - implementation
  - proj
  - coordinate-transform
---

# Implementation Log: proj4 座標変換ライブラリ統合

## Status: ✅ 成功

## 実装内容

### Step 1: proj4 パッケージのインストール
- `npx expo install proj4` を実行
- `package.json` に `"proj4": "^2.20.9"` が追加されたことを確認
- proj4 は型定義をバンドルしている（`dist/index.d.ts`）ため、別途 `@types/proj4` は不要

### Step 2: CRS 定義ファイルの作成
- `src/utils/crsDefinitions.ts` を作成
- LOCAL_XY: Azimuthal Equidistant 投影（AEQD）、マップ中心を原点とするローカル直交座標系
- EPSG:6668 (JGD2011) を将来拡張用に定義
- `setupCRSDefinitions()` で `proj4.defs()` を呼び出し

### Step 3: 座標変換ユーティリティの作成
- `src/utils/coordinateTransform.ts` を作成
- 提供関数:
  - `toLocalXY(lng, lat)` → `[x, y]` (EPSG:4326 → LOCAL_XY)
  - `fromLocalXY(x, y)` → `[lng, lat]` (LOCAL_XY → EPSG:4326)
  - `distanceMeters(from, to)` → 距離（m）
  - `toWebMercator(lng, lat)` → `[x, y]` (EPSG:4326 → EPSG:3857)
  - `fromWebMercator(x, y)` → `[lng, lat]` (EPSG:3857 → EPSG:4326)

### Step 4: boundsBound.ts のリファクタリング
- `METERS_PER_DEG_LAT = 111_320` の簡易近似を削除
- `insetToBounds()` を `toLocalXY`/`fromLocalXY` を使用した正確な測地計算に置き換え
- `lerp()` 関数は引き続き使用するため残した

### Step 5: 型チェック
- `npx tsc --noEmit` で `boundsBound.ts` / `crsDefinitions.ts` / `coordinateTransform.ts` にエラーがないことを確認
- `@/` パスエイリアスは既存コードとの互換性のため `./*` のまま維持。新規インポートは相対パスを使用

## 技術的判断

### パス解決について
- `tsconfig.json` の `paths: { "@/*": ["./*"] }` は既存の全 `@/` インポートが `./*` を前提としているため変更不可
- `boundsBound.ts` からのインポートは相対パス `../../../../../../utils/coordinateTransform` を使用

### LOCAL_XY 投影方式
- Azimuthal Equidistant (AEQD) を選択した理由:
  - 近距離（数km以内）で距離と方位を正確に保持
  - 中心からのメートル単位の距離計算に最適
  - QGIS でのローカル座標系データとの互換性が高い

## 変更ファイル一覧

| ファイル | 操作 |
|---------|------|
| `package.json` | 更新: proj4 依存関係追加 |
| `src/utils/crsDefinitions.ts` | 新規作成: CRS 定義 |
| `src/utils/coordinateTransform.ts` | 新規作成: 座標変換ユーティリティ |
| `src/features/home/map/hooks/camera/useCameraController/boundsBound.ts` | 修正: proj4 ベースの変換に置き換え |

## 未解決事項
- `app.config.ts` の `jsEngine: "hermes"` エラーは事前から存在する既存の問題であり、本タスクとは無関係
- Expo でのパス解決（Babel 設定）は Metro が自動的に tsconfig paths を解決するか要確認。ランタイムテストが必要

## 推奨される次のアクション
1. Expo の開発ビルドでランタイムテストを実施（proj4 の Metro バンドル動作確認）
2. REV によるコードレビュー依頼
3. 本 change をコミット
