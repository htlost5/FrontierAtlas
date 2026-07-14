---
agent: TST
task_id: TASK-compass-001
date: 2026-07-14
status: approved
category: log
destination: docs/logs/impl/testing/
related:
  - "[MapScreen.tsx](../../../../src/features/home/map/MapScreen.tsx)"
tags:
  - TST
  - testing
  - TASK-compass-001
---

# Testing Log: MapScreen.tsx set-state-in-effect 修正

## Test Items

### 1. ESLint — set-state-in-effect 警告の確認

```bash
npx eslint src/features/home/map/MapScreen.tsx --max-warnings=0
EXIT_CODE=0
```

**結果: ✅ 合格** — `set-state-in-effect` 警告なし、その他警告・エラーなし。

### 2. TypeScript 型チェック

```bash
npx tsc --noEmit
# app.config.ts:30 の既存エラー（jsEngine）のみ。MapScreen.tsx はエラーなし。
```

**結果: ✅ 合格** — `MapScreen.tsx` に型エラーなし。

### 3. get_errors (VSCode)

```json
{ "path": "MapScreen.tsx", "errors": [] }
```

**結果: ✅ 合格** — エディター上でもエラーなし。

### 4. ロジック検証

#### 4a. `errorDismissed` の派生

```ts
const [dismissedAtKey, setDismissedAtKey] = useState(0);
const currentKey = floor * 1_000_000 + retryCount;
const errorDismissed = dismissedAtKey === currentKey;
```

- `dismissedAtKey` は初期値 `0`
- `currentKey` は常に `floor * 1_000_000 + retryCount` ≥ 1（floor ≥ 1）
- 初期状態では `dismissedAtKey(0) !== currentKey` → `errorDismissed = false`

**結果: ✅ 正しい**

#### 4b. `floor` 変更時リセット

- `floor` が変わると `currentKey` が変化
- `setDismissedAtKey` は変更されていない → `dismissedAtKey` は古いキーのまま
- `dismissedAtKey !== currentKey` → `errorDismissed = false`

**結果: ✅ 正しい** （useEffect 不要で自動リセット）

#### 4c. `handleDismiss` → `errorDismissed = true`

```ts
const handleDismiss = useCallback(() => {
  setDismissedAtKey(currentKey);
}, [currentKey]);
```

- `setDismissedAtKey(currentKey)` → `dismissedAtKey === currentKey` → `errorDismissed = true`

**結果: ✅ 正しい**

#### 4d. `handleRetry` → `errorDismissed` リセット

```ts
const handleRetry = useCallback(() => {
  setRetryCount((c) => c + 1);
}, []);
```

- `retryCount` 増加 → `currentKey` 変化
- `dismissedAtKey` は古いキーのまま → `dismissedAtKey !== currentKey` → `errorDismissed = false`

**結果: ✅ 正しい**

### 5. 副作用ゼロ確認

- `useEffect` import は削除済み ✅
- 全状態更新はイベントハンドラ（`handleDismiss`, `handleRetry`）内のみ ✅
- レンダリング時の副作用なし ✅

## 総合判定

| テスト項目 | 結果 |
|---|---|
| ESLint (set-state-in-effect) | ✅ 合格 |
| TypeScript 型チェック | ✅ 合格 |
| get_errors | ✅ 合格 |
| ロジック: 派生状態 | ✅ 正しい |
| ロジック: floor 変更時リセット | ✅ 正しい |
| ロジック: dismiss 動作 | ✅ 正しい |
| ロジック: retry 動作 | ✅ 正しい |
| 副作用ゼロ | ✅ 確認済 |

**判定: ✅ 合格**

`useState(false)` → `useEffect` setter のパターンは完全に排除され、`dismissedAtKey` + `currentKey` による派生状態パターンにリファクタリングされている。全テスト項目を通過。副作用なし。
