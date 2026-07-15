---
agent: IMP
task_id: TASK-rev-fixes-geojson
date: 2026-07-08
status: completed
category: log
destination: logs/impl/implementation/
related:
  - "[M1] mobile/src/features/home/map/services/getGeoDataByLogicalId.ts"
  - "[M2] mobile/src/data/geojson/index.ts"
  - "[m1] mobile/src/data/geojson/service/AssetRestoreService.ts"
  - "[m2] mobile/src/data/geojson/repository/GeojsonRepository.ts"
  - "[m3] mobile/src/AppInit/hooks/usePrepareData.ts"
  - "[m4] mobile/src/features/home/map/services/loadGeoJson.ts"
tags:
  - IMP
  - implementation
  - rev-fixes
  - geojson
---

# Implementation Log — REV Fixes for GeoJSON Module

## Summary

REV (Reviewer) からの6件の指摘を修正した。いずれも type-safe な改善とフォールバック処理の強化。

## Changes

### M1 [Medium] — フォールバックチェーンが不完全
- **ファイル**: `mobile/src/features/home/map/services/getGeoDataByLogicalId.ts`
- **修正**: SQLite キャッシュ不在時に `geoJsonMap` からアセットを取得し SQLite に保存するフォールバック処理を追加。`geoJsonMap` の import を追加。

### M2 [Medium] — failed_updates の累積問題
- **ファイル**: `mobile/src/data/geojson/index.ts`
- **修正**: `checkAndUpdate()` の全ファイル成功時（`failed.length === 0`）に `repo2.clearFailures()` を呼び出すよう追記。

### m1 [Minor] — AssetRestoreService の unsafe type cast
- **ファイル**: `mobile/src/data/geojson/service/AssetRestoreService.ts`
- **修正**: `AssetManifest` 型を定義し、`as unknown as BuildManifest` → `as AssetManifest` に変更。ランタイム検証（`version`/`files` の存在確認）を追加。

### m2 [Minor] — 動的 import の信頼性
- **ファイル**: `mobile/src/data/geojson/repository/GeojsonRepository.ts`
- **修正**: `migrateLegacyLocalManifest()` 内の `await import(...)` を静的 import に変更。`expoRead` と `LOCAL_MANIFEST_PATH` をファイル先頭で import。

### m3 [Minor] — checkAndUpdate の fire-and-forget 問題
- **ファイル**: `mobile/src/AppInit/hooks/usePrepareData.ts`
- **修正**: `checkAndUpdate()` を try-catch ブロック内に移動。`initializeGeoData()` 成功後に `setReady(true)` を設定し、その後に `checkAndUpdate()` を fire-and-forget で実行。

### m4 [Minor] — loadGeoJson のエラーハンドリング
- **ファイル**: `mobile/src/features/home/map/services/loadGeoJson.ts`
- **修正**: `expoRead()` を try-catch でラップ。失敗時に `geoJsonMap` からアセットバンドルフォールバックを試行。戻り値の型注釈 `Promise<FeatureCollection>` を追加。

## Verification

- `npx tsc --noEmit`: エラーなし（出力なし = 成功）
