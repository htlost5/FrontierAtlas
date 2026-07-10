---
agent: REV
task_id: TASK-map-batch-data-load
date: 2026-07-10
status: pending
category: log
destination: _inbox/
related:
  - "[IMP 実装成果物] MapScreen.tsx, useBatchMapData.ts, FullScreenLoading.tsx, ErrorOverlay.tsx"
tags:
  - REV
  - handoff
  - code-review
---

# HANDOFF: REV → TST (with CRITICAL → IMP)

## Metadata
| Field | Value |
|-------|-------|
| **From** | REV (Reviewer) |
| **To** | TST (Tester) — **ただし CRITICAL 差し戻し条件あり** |
| **Task ID** | TASK-map-batch-data-load |
| **Status** | **partial** — 1 CRITICAL, 5 Conditionals |
| **Confidence** | medium |
| **Handoff Type** | forward (with CRITICAL routing to IMP) |

---

## Task Context（継承・追記セクション）

### Original Request
マップデータ一括ロード実装のコードレビュー。6ソースの GeoJSON データを `Promise.all` で一括取得し、全成功時のみ MapLibre `MapView` をマウントする「一括ロード→一括描画」方式への再設計を検証。

### Review Targets
- `mobile/src/features/home/map/hooks/dataLoad/useBatchMapData.ts`
- `mobile/src/features/home/map/components/FullScreenLoading.tsx`
- `mobile/src/features/home/map/components/ErrorOverlay.tsx`
- `mobile/src/features/home/map/MapScreen.tsx`

### Constraints
- 初回ロード中は `MapContainer`（MapView）をレンダリングしない
- 全6ソース `Promise.all` 一括取得成功時のみ描画（All-or-Nothing）
- フロア切替時、floor 非依存データ（venue, buildings, stairs）は再取得しない
- フロア切替中は前フロアのデータを表示し続ける（stale-while-revalidate）
- `AbortController` で race condition 防止
- hooks の呼び出し順が条件分岐で変わらないこと

---

## Key Findings / Decisions

### ◆ アーキテクチャ要件適合マトリクス

| # | 要件 | 結果 | 詳細 |
|---|------|------|------|
| R1 | 初回ロード中は MapContainer 非マウント | ✅ 合格 | `isInitialLoading` 時に `FullScreenLoading` のみ返す early return |
| R2 | 全6ソースを `Promise.all` 一括取得・全成功時のみ描画 | ✅ 合格 | 初回: 4 + 2 = 6 ソース。キャッシュ時: 2 ソース。`setState("ready")` は全成功後にのみ |
| R3 | floor 非依存データはキャッシュで再取得しない | ✅ 合格 | `cacheRef.current` で初回のみ取得。2回目以降はキャッシュ読み取り |
| R4 | フロア切替中は前フロアデータを表示 | ✅ 合格 | `prevFloorDataRef.current` + `displayFloorData` で stale-while-revalidate |
| R5 | `AbortController` で race condition 防止 | ✅ 合格 | `useEffect` cleanup で `controller.abort()`, `signal.aborted` チェック |
| R6 | `MapIconLabel` に `batchData.currentFloor` が渡される | ✅ 合格 | `batchData.currentFloor` (`currentFloorRef.current`) を使用 |
| R7 | 一部取得失敗時は全体エラー、部分描画しない | ✅ 合格 | catch 内で error state のみ設定, 正常系 state は未更新 |
| R8 | `getGeoDataByLogicalId` シグネチャ変更なし | ✅ 合格 | 既存の `(MapId) => Promise<FeatureCollection>` のまま再利用 |

---

### ◆ 指摘事項一覧

#### 🔴 CRITICAL-1: `handleDismiss` が dismiss ではなく retry として動作する

**ファイル**: `MapScreen.tsx` (lines 37-41)

**問題**:
```typescript
const handleDismiss = useCallback(() => {
  // dismiss: 前フロアのデータを維持したままエラーを非表示
  setRetryCount((c) => c + 1); // floor を変えずに再レンダリング
}, []);
```
コメントには「前フロアのデータを維持したままエラーを非表示」とあるが、実装は `setRetryCount((c) => c + 1)` で、これは `handleRetry` と完全に同一の動作となる。

`retryCount` 変更 → `useBatchMapData` の retryKey 変化 → キャッシュ全リセット → `isInitial: true` の fullscreen loading 表示 → 全データ再フェッチ → 全画面ローディング。

**影響**: フロア切替エラー時にユーザーが「閉じる」を押しても、意図に反して全画面ローディング＋再試行が発生する。dismiss 本来の動作（前フロアデータを表示したままエラーバナーを非表示）が実現できない。

**修正案**: MapScreen 内で dismissed 状態を管理するローカル state を追加する。
```typescript
const [dismissedError, setDismissedError] = React.useState(false);

// floor 変更時に dismiss 状態をリセット
React.useEffect(() => { setDismissedError(false); }, [floor]);

// render 内
{batchData.floorError && !dismissedError && (
  <ErrorOverlay
    variant="overlay"
    visible={true}
    message={batchData.floorError.message}
    onRetry={handleRetry}
    onDismiss={() => setDismissedError(true)}
  />
)}
```

**重大度**: CRITICAL — 動作仕様（dismiss）と実装が不一致の動作バグ

---

#### 🟡 CONDITIONAL-1: 初回エラー時のエラーメッセージ抽出に不要なキャストと冗長チェック

**ファイル**: `MapScreen.tsx` (lines 77-82)

```typescript
if (batchData.state.status === "error" && batchData.state.isInitial === true) {
  const errMsg =
    batchData.state.status === "error"        // ← 外側のifで既に確認済み
      ? (batchData.state as Extract<...>).error.message  // ← 不要なキャスト
      : "不明なエラー";
```

TypeScript の discriminated union の narrowing により、`state.status === "error"` が確実なスコープ内で `error.message` にアクセス可能。`as Extract<>` と inner `status === "error"` チェックは不要。下記で十分。

```typescript
const errMsg = batchData.state.error.message;
```

**改善度**: 低（動作には影響しないが readability 低下）

---

#### 🟡 CONDITIONAL-2: catch の error 型アサーションが非 Error オブジェクトに対応できない

**ファイル**: `useBatchMapData.ts` (line 141)

```typescript
} catch (e) {
  if (signal.aborted) return;
  setState({ status: "error", error: e as Error, isInitial });
}
```

`e as Error` のアサーションは、throw された値が `Error` インスタンスであることを前提としている。JavaScript では文字列など任意の値が throw されうる。その場合 `.message` が `undefined` になる。

**改善案**:
```typescript
const error = e instanceof Error ? e : new Error(String(e));
```

**改善度**: 中（防御的プログラミング。通常は Error が throw される前提でよいが、予期せぬエラー形式への耐性が低い）

---

#### 🟡 CONDITIONAL-3: `BatchState` の discriminated union で `as BatchState` キャストを使用

**ファイル**: `useBatchMapData.ts` (line 80)

```typescript
setState({ status: "loading", isInitial } as BatchState);
```

`isInitial` が汎用 `boolean` 型のため、`{ status: "loading"; isInitial: true }` / `{ status: "loading"; isInitial: false }` の literal 型に narrow できない。これ自体は runtime 問題ではないが、型安全上の妥協。

**改善案**:
```typescript
setState((isInitial
  ? { status: "loading", isInitial: true as const }
  : { status: "loading", isInitial: false as const }
));
```
または `BatchState` の定義を簡略化する（両方の loading variant を統一: `{ status: "loading"; isInitial: boolean }` にし、runtime チェックで `=== true` を使う）。

**改善度**: 低（runtime 影響なし。型の完全性のための提案）

---

#### 🟡 CONDITIONAL-4: フロア切替中オーバーレイが `MapView` の children としてレンダリングされる

**ファイル**: `MapScreen.tsx` (lines 92-94) + `MapContainer.tsx`

```tsx
<MapContainer ...>
  {batchData.isFloorSwitching && (
    <FullScreenLoading message="フロア切替中..." />
  )}
  ...
</MapContainer>
```

`FullScreenLoading` は `View` ベースの React Native コンポーネント。MapLibre `MapView` の children としてレンダリングされるが、MapLibre の children レンダリング動作（React Native view として表示されるか、Z-order が正しいか）は実装依存。

`FullScreenLoading` が `MapView` 内で期待通り地図の上に表示されない場合、オーバーレイとして機能しない可能性がある。

**改善案**: `MapContainer` の外で absolute position の View としてレンダリングするか、動作確認を実施する。

**改善度**: 中（MapLibre RN の実装依存。実際に表示を確認する必要あり）

---

#### 🟡 CONDITIONAL-5: `isFloorSwitching` 中に `VenueView` / `BuildingsView` が再レンダリングされる

**ファイル**: `MapScreen.tsx` (lines 101-126)

フロア切替中（`isFloorSwitching === true`）でも `VenueView` や `BuildingsView` は常にレンダリングされる。これらは floor 非依存データなので再描画は不要だが、React のレンダリングは防げていない（`batchData.venue` / `batchData.buildings` が state 変化で新しい参照になるため）。

**影響**: パフォーマンス上の懸念（軽微）。`React.memo` が各 View に適用されていれば実害なし。

**改善度**: 低（`React.memo` 適用有無に依存。確認推奨）

---

### ◆ 削除ファイルの参照漏れチェック

| 削除ファイル | 参照残り |
|---|---|
| `components/LoadingOverlay.tsx` | **なし** ✅ |
| `hooks/dataLoad/useMapGeoData.ts` | **なし** ✅ |
| `hooks/dataLoad/useFloorGeoData.ts` | **なし** ✅ |
| `hooks/dataLoad/useGeoDataByLogicalId.ts` | **なし** ✅（services/ の `getGeoDataByLogicalId` は別ファイルで存続） |

全ファイルで削除されたコンポーネントや hook への import 残骸は確認されませんでした。

### ◆ React Hooks の呼び出し順チェック

`MapScreen.tsx` の hooks はすべて early return の前に呼び出されている ✅

```
useMapContext()         → line 27
useDisplayLevel(zoom)  → line 28
useState(0)            → line 32
useBatchMapData(...)   → line 33
useCallback (retry)    → line 34
useCallback (dismiss)  → line 37
useRef (prevZoomRef)   → line 45
useCallback (region)   → line 46
```

条件分岐や early return による hooks 呼び出し順の変動はありません。

### ◆ メモリリーク・キャッシュ解放チェック

- `cacheRef.current` は retryKey 変更時に `null` リセット ✅
- `prevFloorDataRef.current` も同様 ✅
- 通常の floor 変更時はキャッシュを保持（意図通り） ✅
- `AbortController` が useEffect cleanup で abort される ✅
- 定期的なキャッシュ解放機構はなし → **条件付き**: アプリ終了まで初回取得データを保持し続ける。メモリ制約が厳しい環境では懸念

### ◆ Race Condition 網羅性

`signal.aborted` チェック箇所:
1. 初回 `Promise.all` 完了後 (line 99) ✅
2. フロアデータ `Promise.all` 完了後 (line 116) ✅
3. 状態更新前 (line 122) ✅
4. catch 内 (line 140) ✅

全非同期処理の後で `signal.aborted` チェックが行われており、網羅性は十分です。

---

## Artifacts
| Path | Type | Description |
|------|------|-------------|
| `_inbox/2026-07-10_2354_REV_map-batch-load-review.md` | review | 本レビュー成果物 |

---

## Open Questions
1. **handleDismiss の意図**: dismiss（エラー非表示のみ）と retry（再試行）を分離するのか、それとも dismiss は実質 retry でよいのか → **CRITICAL として IMP に差し戻し**
2. **MapLibre の children レンダリング**: `FullScreenLoading` が `MapView` の children として正しくオーバーレイ表示されるか → 実機での視認確認が必要
3. `React.memo` が `VenueView` / `BuildingsView` に適用されているか → フロア切替時の不要再レンダリングの有無

---

## Routing
| Field | Value |
|-------|-------|
| **Next Agent** | ~~TST~~ → **IMP**（CRITICAL 差し戻し） |
| **Blockers** | CRITICAL-1: `handleDismiss` が retry と同一動作で、仕様の dismiss を実現できない |
| **Priority** | high |
| **Deadline** | — |

---

## Role-Specific Output

### Review Result
| 判定 | ⚠️ **Conditional Approval — with 1 CRITICAL** |
|------|------|
| **CRITICAL (差し戻し)** | 1件 — `handleDismiss` の動作バグ |
| **Conditional** | 5件 — 型安全・冗長コード・レンダリング懸念 |

### 推奨フロー
**REV → IMP（CRITICAL 修正） → IMP → REV（再レビュー） → TST → REL**

1. `IMP` が CRITICAL-1 を修正
2. Conditional 項目は任意対応（レビュアー推奨）
3. 修正確認後、REV → TST へ forward しテスト実施

### 修正優先順位
| 優先度 | 項目 | 種別 |
|--------|------|------|
| P0 | CRITICAL-1: handleDismiss | 動作バグ |
| P1 | CONDITIONAL-2: error 型アサーション | 防御的 |
| P2 | CONDITIONAL-4: MapView children overlay | 表示確認 |
| P3 | CONDITIONAL-1/3: 型安全リファクタリング | コード品質 |
| P4 | CONDITIONAL-5: 不要再レンダリング | パフォーマンス |
