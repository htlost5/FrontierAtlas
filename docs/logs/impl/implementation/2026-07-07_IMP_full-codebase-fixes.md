---
agent: IMP
task_id: TASK-full-codebase-fixes
date: 2026-07-07
status: draft
category: log
destination: logs/impl/implementation/
tags:
  - IMP
  - implementation
  - refactoring
---

# 実装ログ: src/ 全領域の評価結果に基づく修正

## 概要

`mobile/src/` 全領域の評価結果に基づくコード修正タスク。P1(CRITICAL)〜P3(軽微)の全項目を実施。

## 修正ファイル一覧

### P1-1: asset/remote の add/update 完全重複を統合

| ファイル | 操作 | 内容 |
|----------|------|------|
| `src/data/geojson/assetDataSet/tasks/dataUpdate/update/update.ts` | 編集 | 再exportに変更 (`assetDataAdd as assetDataUpdate`) |
| `src/data/geojson/remoteDataSet/tasks/dataUpdate/update/update.ts` | 編集 | 再exportに変更 (`remoteDataAdd as remoteDataUpdate`) |

### P1-2: `saveWithVerify.ts` の不要な中間ラッパー削除

| ファイル | 操作 | 内容 |
|----------|------|------|
| `src/data/geojson/remoteDataSet/useCase/download/saveWithVerify.ts` | 削除 | 中間ラッパー削除 |
| `src/data/geojson/remoteDataSet/tasks/dataUpdate/update/add.ts` | 編集 | `downloadWithVerify` を直接呼ぶよう修正 |

### P1-3: `fetchJsonWithRetry` / `fetchTextWithRetry` の統合

| ファイル | 操作 | 内容 |
|----------|------|------|
| `src/infra/network/fetchJson.ts` | 編集 | 共通コア `fetchWithRetryCore` を抽出、両関数を薄いラッパー化 |

### P2-1: `domain/` 層の拡充

| ファイル | 操作 | 内容 |
|----------|------|------|
| `src/domain/manifestTypes.ts` | 新規作成 | `manifestType.ts` から移動 |
| `src/domain/index.ts` | 新規作成 | domain層全export |
| `src/data/geojson/manifestType.ts` | 削除 | 古いファイル削除 |
| 全14ファイル | 編集 | importパスを `@/src/domain/manifestTypes` に変更 |

### P2-2: `data/geojson/index.ts` の責務分割

| ファイル | 操作 | 内容 |
|----------|------|------|
| `src/data/geojson/index.ts` | 編集 | `handleLoadError()` を抽出、`expoWalk` import 削除 |

### P2-3: `updateRegistry` の差分更新化

| ファイル | 操作 | 内容 |
|----------|------|------|
| `src/data/geojson/tasks/updateRegistry/index.ts` | 編集 | `UpdateType` 差分対応＋fallback全件再読み込み |
| `src/data/geojson/assetDataSet/index.ts` | 編集 | `updateRegistry` 呼び出しに `updatePlan` を追加 |
| `src/data/geojson/remoteDataSet/index.ts` | 編集 | `updateRegistry` 呼び出しに `updatePlan` を追加 |

### P2-4: `Header.tsx` のクリーンアップ

| ファイル | 操作 | 内容 |
|----------|------|------|
| `src/shared/components/Header/Header.tsx` | 編集 | コメントアウト旧コード削除、`account_size` 定数削除 |

### P3-1: `jsonParser` の型安全化

| ファイル | 操作 | 内容 |
|----------|------|------|
| `src/infra/jsonParse/jsonParser.ts` | 編集 | `parseJson<T>`, `stringifyJson<T>` にgeneric化 |

### P3-2: `fetchWrapper.ts` のデッドコード除去

| ファイル | 操作 | 内容 |
|----------|------|------|
| `src/infra/network/fetchWrapper.ts` | 編集 | `SIMULATE_OFFLINE` 定数と分岐を削除 |

### P3-4: `usePrepareData` の stale closure 修正

| ファイル | 操作 | 内容 |
|----------|------|------|
| `src/AppInit/hooks/usePrepareData.ts` | 編集 | `useRef` 導入、`geoDataSource` deps 削除、コールバックで値取得 |

### 型チェック副作用修正

| ファイル | 操作 | 内容 |
|----------|------|------|
| `src/features/home/map/services/loadGeoJson.ts` | 編集 | `parseJson<FeatureCollection>` に型付け |
| `src/data/geojson/tasks/updateRegistry/index.ts` | 編集 | `FeatureCollection` import 追加、`parseJson<FeatureCollection>` に型付け |

## 検証結果

| 項目 | 結果 |
|------|------|
| TypeScript 型チェック (`npx tsc --noEmit`) | ✅ エラー0 |
| ESLint (`npx expo lint`) | ✅ エラー0 |
