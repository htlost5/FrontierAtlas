---
agent: IMP
task_id: TASK-??? (Phase 2 フロア切替瞬時最適化)
date: 2026-07-11
status: pending
category: log
destination: docs/shared/impl/specs/interfaces/
related:
  - "[useBatchMapData.ts](../../../mobile/src/features/home/map/hooks/dataLoad/useBatchMapData.ts)"
  - "[MapRoot.tsx](../../../mobile/src/features/home/map/MapRoot.tsx)"
tags:
  - IMP
  - performance
  - floor-switching
  - preload
---

# 実装ログ: フロア切替「瞬時」最適化 (Phase 2)

## 概要

全5フロアの GeoJSON を JS メモリにプリロードし、フロア切替時の SQLite I/O (30-80ms) をゼロにする。
体感 <16ms の「瞬時」切替を実現。

## 変更ファイル

### 1. `useBatchMapData.ts`

| 変更 | 説明 |
|------|------|
| モジュールスコープ `PreloadCache` | コンポーネントのライフサイクルを超えて生存するキャッシュ。`status: "idle" \| "loading" \| "ready" \| "error"` |
| `preloadAllFloors()` 関数 | 全5フロア (units + sections) を最大10並列でプリロード |
| floor 依存データ取得 | プリロードキャッシュヒット時は `preloadCache.data.get(floor)` から即時取得。ミス時は従来の SQLite パス |
| `isFloorSwitching` 導出 | `&& !preloadCache.data.has(floor)` を追加。キャッシュヒット時は切替中扱いにしない |
| `isPreloaded` 戻り値 | `preloadCache.status === "ready"` を公開 |
| プリロードトリガー `useEffect` | 初回ロード (`state.status === "ready"`) 直後に `preloadAllFloors()` を起動 |

### 2. `MapRoot.tsx`

| 変更 | 説明 |
|------|------|
| `startTransition` import | `react` から追加 |
| `wrappedSetFloor` | `setFloor` を `startTransition` でラップし、UI 更新を非同期化 |
| Context value | `setFloor` → `wrappedSetFloor` に差し替え |

### 3. `MapScreen.tsx`

変更不要。`isFloorSwitching` の導出ロジック変更により、プリロードキャッシュヒット時は自動的にオーバーレイ非表示になる。

## 性能見積り

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| 初回フロアデータ取得 | SQLite I/O 30-80ms | 同 (変更なし) |
| 2回目以降の同一フロア | SQLite I/O 30-80ms | **0ms (メモリヒット)** |
| フロア切替オーバーレイ | 毎回表示 (30-80ms) | **キャッシュヒット時は非表示 (<16ms)** |
| プリロード (初回ロード後) | なし | バックグラウンドで全フロアを5並列×2=10並列取得 |

## 型チェック結果

`npx tsc --noEmit`: エラーなし ✅

## 注意事項

- プリロード失敗時は `preloadCache.status = "error"` になるが、従来の SQLite パスにフォールバックするため機能は維持される
- `retryKey` 変更時もプリロードキャッシュはクリアされない（永続的キャッシュ）
