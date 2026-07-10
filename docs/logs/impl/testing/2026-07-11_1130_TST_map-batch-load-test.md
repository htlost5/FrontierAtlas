---
agent: TST
task_id: TASK-map-batch-data-load
date: 2026-07-11
status: approved
category: log
destination: logs/impl/testing/
related:
  - "[HANDOFF REV→TST](../../../_inbox/2026-07-10_2359_HANDOFF_REV_TST_map-batch-load-re-review.md)"
  - "[REV 一次レビュー](../../../_inbox/2026-07-10_2354_REV_map-batch-load-review.md)"
  - "[実装コード] MapScreen.tsx"
  - "[useBatchMapData](../../../mobile/src/features/home/map/hooks/dataLoad/useBatchMapData.ts)"
tags:
  - TST
  - map-batch-load
  - static-analysis
  - testing
---

# HANDOFF: TST → REL

## Metadata

| Field | Value |
|-------|-------|
| **From** | TST (Tester) |
| **To** | REL (Release Manager) |
| **Task ID** | TASK-map-batch-data-load |
| **Status** | **success** — 全テスト合格 |
| **Confidence** | high |
| **Handoff Type** | forward |

---

## Task Context（継承・追記セクション）

### Original Request
マップデータ一括ロード実装のテスト。全6ソースの GeoJSON データを `Promise.all` で一括取得し、全成功時のみ MapLibre `MapView` をマウントする「一括ロード→一括描画」方式の静的検証。

### Test Method
静的解析（コードの論理パス検証）。実機実行は不要との指示により、全コードパスをトレースして正常性を確認。

---

## Test Results Summary

| # | Test Item | Status | Detail |
|---|-----------|--------|--------|
| **T1** | 初回ロード — 全データ完了まで MapView 非表示 | ✅ **PASS** | 3-State Rendering の State 1: `isInitialLoading=true` → `return <FullScreenLoading />` で MapContainer 非マウント確定 |
| **T2** | 初回ロード失敗 — エラー表示 | ✅ **PASS** | State 2: `status==="error" && isInitial===true` → `return <ErrorOverlay variant="fullscreen">`。MapView 一切非表示 |
| **T3** | リトライ動作 | ✅ **PASS** | `handleRetry = setRetryCount(c=>c+1)` → useEffect 再実行。`ErrorOverlay` 内 throttle (`RETRY_THROTTLE_MS=2000`) で連打防止。再試行成功後 `setState({status:"ready"})` → MapView 正常表示 |
| **T4** | フロア切替 — 前フロア維持 | ✅ **PASS** | `cacheRef.current` で floor 非依存データ保持。`displayFloorData = floorData ?? prevFloorDataRef.current` で切替中も前フロア表示維持。`MapIconLabel` に `batchData.currentFloor` が正しく渡される |
| **T5** | フロア切替失敗 — エラーオーバーレイ | ✅ **PASS** | `floorError` + `errorDismissed` で制御。`useEffect([floor, retryCount])` で自動リセット。MapView + 前フロアデータは維持。閉じる（dismiss）+ 再試行（retry）独立動作確認 |
| **CONDITIONAL-4** | FullScreenLoading の MapView 内表示 | ✅ **PASS**（静的確認） | 初回ロード時は MapContainer 外（独立 return）。フロア切替時は MapContainer 内だが `flex:1` + 全画面スタイルで MapView を正しく覆う構造 |

### OVERALL: ✅ **PASS** — 全テスト合格

---

## テスト詳細

### T1: 初回ロード — 全データ完了まで MapView 非表示

**検証パス:**
```
MapScreen()
  → useBatchMapData(floor, retryCount)
    → state = { status:"loading", isInitial:true }
  → batchData.isInitialLoading === true
  → return <FullScreenLoading />   // ← MapContainer 未マウント
```

**確認ポイント:**
- ✅ `useState<BatchState>({ status:"loading", isInitial:true })` で初期化
- ✅ `isInitialLoading = state.status === "loading" && state.isInitial === true` — 初回 loading のみ true
- ✅ `MapContainer` は State 3（else branch）でのみレンダリング
- ✅ ロード中にグレーの空マップが表示されるパスなし

### T2: 初回ロード失敗 — エラー表示

**検証パス:**
```
getGeoDataByLogicalId が throw
  → catch ブロック
    → setState({ status:"error", error:e as Error, isInitial:true })
MapScreen()
  → batchData.state.status === "error"
  → batchData.state.isInitial === true
  → return <ErrorOverlay variant="fullscreen" ... />
```

**確認ポイント:**
- ✅ `variant="fullscreen"` → fullscreenContainer（⚠️ + メッセージ + 再試行ボタン）
- ✅ MapView レンダリングパスなし（100% non-MapView）
- ✅ `ErrorOverlay` は `visible={true}` → null 非表示パスを通らない

### T3: リトライ動作

**Throttle 検証:**
- `ErrorOverlay` 内の `handleRetry`:
  ```ts
  const lastRetryRef = useRef<number>(0);
  const handleRetry = useCallback(() => {
    const now = Date.now();
    if (now - lastRetryRef.current < RETRY_THROTTLE_MS) return;  // 2000ms
    lastRetryRef.current = now;
    onRetry?.();
  }, [onRetry]);
  ```
- ✅ `onRetry` は `MapScreen.handleRetry` = `setRetryCount((c) => c + 1)`
- ✅ throttle window 内の連打は `onRetry` 呼ばず → 無害
- ✅ `setRetryCount` → useEffect 依存配列 `[floor, retryKey]` の `retryKey` (=retryCount) 変更 → 再実行
- ✅ キャッシュリセット: `prevRetryKeyRef.current !== retryKey` → `cacheRef.current = null`
- ✅ 再取得成功 → `setState({ status:"ready" })` → MapView 表示

### T4: フロア切替 — 前フロア維持

**キャッシュ機構:**
```ts
// floor 非依存データ (venue, buildings, stairs)
if (cacheRef.current === null) {
  const results = await Promise.all([
    getGeoDataByLogicalId(venue),
    getGeoDataByLogicalId(studyhall),
    getGeoDataByLogicalId(interact),
    getGeoDataByLogicalId(stair),
  ]);
  cacheRef.current = { venue: v, buildings: b, stairs: s };
} else {
  v = cacheRef.current.venue;
  b = cacheRef.current.buildings;
  s = cacheRef.current.stairs;
}
```

**Stale-While-Revalidate:**
```ts
const displayFloorData = floorData ?? prevFloorDataRef.current;
```

**確認ポイント:**
- ✅ 2回目以降の floor 変更 → `cacheRef.current !== null` → キャッシュ読み取りのみ（`getGeoDataByLogicalId` 未呼び出し）
- ✅ floor 依存データ（units, sections）は毎回 `Promise.all` で取得
- ✅ 切替中は `state = { status:"loading", isInitial:false }` → `isFloorSwitching = true`
- ✅ `prevFloorDataRef.current` に前回値を保持 → `displayFloorData` で null 時は前値
- ✅ `MapIconLabel` → `floor_num={batchData.currentFloor}` → `currentFloorRef.current = floor`（最新 floor）

### T5: フロア切替失敗 — エラーオーバーレイ

**エラー表示制御:**
```ts
const [errorDismissed, setErrorDismissed] = React.useState(false);
// floor または retry 変更時に dismiss 状態をリセット
useEffect(() => { setErrorDismissed(false); }, [floor, retryCount]);

// フロア切替エラー表示条件
{batchData.floorError && !errorDismissed && (
  <ErrorOverlay variant="overlay" ... />
)}
```

**確認ポイント:**
- ✅ `floorError` は `state.status === "error" && !state.isInitial` が条件 → フロア切替時のエラーでのみ true
- ✅ `errorDismissed` が false の間のみ ErrorOverlay 表示
- ✅ `handleDismiss` = `setErrorDismissed(true)` → overlay のみ非表示、MapView + 前フロアデータは維持（MapContainer 内の他の children への影響なし）
- ✅ `handleRetry` = `setRetryCount(c=>c+1)` → useEffect 再実行 + `errorDismissed` リセット
- ✅ 別フロア切替 → floor 変更 → `useEffect([floor, retryCount])` → `setErrorDismissed(false)` → 自動リセット

---

## アーキテクチャ要件適合マトリクス

| # | 要件 | 結果 | 根拠 |
|---|------|------|------|
| R1 | 初回ロード中は MapContainer 非マウント | ✅ | `isInitialLoading` 早期 return |
| R2 | 全6ソース `Promise.all` 一括成功時のみ描画 | ✅ | catch で partial set なし、成功時のみ一括 setState |
| R3 | floor 非依存データはキャッシュ再利用 | ✅ | `cacheRef.current` で保持、2回目以降はキャッシュ読み取り |
| R4 | フロア切替中は前フロアデータを表示 | ✅ | `displayFloorData = floorData ?? prevFloorDataRef.current` |
| R5 | `AbortController` で race condition 防止 | ✅ | cleanup → `controller.abort()`、各所で `signal.aborted` チェック |
| R6 | `MapIconLabel` に `batchData.currentFloor` | ✅ | `floor_num={batchData.currentFloor}` |
| R7 | 一部取得失敗→全体エラー、部分描画なし | ✅ | catch ブロックで error state、partial set されない |
| R8 | `getGeoDataByLogicalId` シグネチャ不変 | ✅ | 呼び出し側変更なし |

---

## Hooks 呼び出し順チェック

全パスで同一順序を確認（早期 return 前に全 hook 呼び出し完了）。

```
Line 26: useMapContext()
Line 27: useDisplayLevel(zoom)
Line 31: useState(0)              ← retryCount
Line 33: useState(false)          ← errorDismissed (NEW)
Line 34: useBatchMapData(...)
Line 36: useEffect                ← dismiss reset (NEW)
Line 38: useCallback (retry)
Line 41: useCallback (dismiss)    (NEW)
Line 43: useRef (prevZoomRef)
Line 44: useCallback (region)
```

✅ **全 hooks が条件分岐前に呼び出されており、呼び出し順の変動なし。**

---

## 未修正 Conditional 項目の評価

| # | 項目 | 重大度 | 評価 |
|---|------|--------|------|
| CONDITIONAL-2 | `catch (e) { e as Error }` 型アサーション | **軽微** | `getGeoDataByLogicalId` は `new Error()` のみ throw。runtime 安全 |
| CONDITIONAL-3 | `as Extract<BatchState, ...>` キャスト | **軽微** | 事前に `status === "error"` 確認済み。runtime 安全 |
| CONDITIONAL-4 | MapView children overlay 表示 | **軽微** | 静的解析で `flex:1`+全画面スタイル確認。実機視認は推奨レベル |
| CONDITIONAL-5 | 不要再レンダリング | **軽微** | 初回以降はキャッシュ値で setState。perf 影響は軽微。`React.memo` 適用は任意 |

**判定: 全 Conditional 項目ともリリースブロッカーに該当せず。**

---

## Artifacts

| Path | Type | Description |
|------|------|-------------|
| `docs/_inbox/2026-07-11_1130_TST_map-batch-load-test.md` | test-log | 本テストログ（HANDOFF 形式） |

### レビュー対象コード

| ファイル | 種別 | ステータス |
|---------|------|----------|
| `mobile/src/features/home/map/MapScreen.tsx` | 修正済み | ✅ REV 再レビュー承認済み |
| `mobile/src/features/home/map/hooks/dataLoad/useBatchMapData.ts` | 新規 | ✅ テスト合格 |
| `mobile/src/features/home/map/components/FullScreenLoading.tsx` | 新規 | ✅ テスト合格 |
| `mobile/src/features/home/map/components/ErrorOverlay.tsx` | 新規 | ✅ テスト合格 |
| `mobile/src/features/home/map/components/MapContainer.tsx` | 既存 | ✅ 変更なし・影響なし |

---

## Open Questions

1. なし — 全テスト項目合格。CONDITIONAL-4 の実機視認確認は REL 後の QA 工程で任意実施可能。

---

## Routing

| Field | Value |
|-------|-------|
| **Next Agent** | **REL** (Release Manager) |
| **Blockers** | なし |
| **Priority** | high |
| **Deadline** | — |

---

## Role-Specific Output

### Test Result

| 判定 | ✅ **PASS — 全テスト合格** |
|------|------|
| **Tests Total** | 5項目（T1〜T5）+ CONDITIONAL-4 確認 |
| **PASS** | 6 / 6 |
| **FAIL** | 0 |
| **Blockers** | なし |
| **Conditional 残存** | 4件（全て軽微、リリース非ブロッカー） |

### 推奨フロー

**TST（テスト完了）→ REL（リリース）**

1. REL がリリース作業を実施
2. 実機での CONDITIONAL-4（MapView overlay 表示）確認は QA 工程で任意実施
