---
agent: IMP
task_id: TASK-map-batch
date: 2026-07-10
status: draft
category: log
destination: logs/impl/implementation/
related:
  - "[MapScreen](../src/features/home/map/MapScreen.tsx)"
tags:
  - IMP
  - map
  - batch-load
  - refactor
---

# Implementation Log: マップデータ一括ロード方式

## 概要

MapLibre の `MapView` を全 GeoJSON データのロード完了後に初めてマウントする「一括ロード→一括描画」方式に変更。

## 変更内容

### 新規作成（3ファイル）

| ファイル | 説明 |
|----------|------|
| `useBatchMapData.ts` | 一括データロードHook。`AbortController` で race condition 防止。初回は全データ、フロア切替時は floor 依存データのみ再取得。`stale-while-revalidate` で前フロアデータを保持。 |
| `FullScreenLoading.tsx` | 初回ロード中に MapContainer の代わりに表示するフルスクリーンローディング。 |
| `ErrorOverlay.tsx` | 初回エラー（fullscreen）とフロア切替エラー（overlay）の両方に対応する統合エラーコンポーネント。リトライは 2秒 throttle 付き。 |

### 変更（1ファイル）

| ファイル | 説明 |
|----------|------|
| `MapScreen.tsx` | 3-State Rendering に変更。State 1: 初回ロード中 → FullScreenLoading。State 2: 初回エラー → ErrorOverlay fullscreen。State 3: データ完備/フロア切替中/フロア切替エラー → MapContainer 常時マウント。 |

### 削除（4ファイル）

| ファイル | 理由 |
|----------|------|
| `LoadingOverlay.tsx` | FullScreenLoading + ErrorOverlay に統合 |
| `useMapGeoData.ts` | useBatchMapData に統合 |
| `useFloorGeoData.ts` | useBatchMapData に統合 |
| `useGeoDataByLogicalId.ts` | useBatchMapData 内で直接 getGeoDataByLogicalId を呼ぶ方式に変更 |

## 設計判断

- **リトライ戦略**: `retryCount` 内部カウンタを `useBatchMapData` に渡し、変更時に `cacheRef` をリセット + useEffect 再実行で全データ再フェッチ
- **キャッシュ**: 初回取得成功後は `cacheRef` に venue/buildings/stairs を保持し、フロア切替時は floor データのみ再取得
- **stale-while-revalidate**: フロア切替中は `prevFloorDataRef.current` を `floorData` が null のとき代わりに返す
- **初回エラー時**: `MapContainer` 自体をマウントしない（MapLibre の空マップ表示を防止）

## 品質チェック

- [x] `AbortController` で race condition 防止
- [x] 初回ロード中は `MapContainer` 非マウント
- [x] 全データ取得成功時に全レイヤー同時描画
- [x] フロア切替中は前フロアが表示され続ける
- [x] `MapIconLabel` に `batchData.currentFloor` が渡されている
- [x] `getGeoDataByLogicalId` のシグネチャは変更なし
- [x] 削除したファイルを import している箇所がない
- [x] TypeScript エラーなし
