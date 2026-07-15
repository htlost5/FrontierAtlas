---
agent: REV
task_id: TASK-compass-001
date: 2026-07-15
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-compass-001](../../shared/tasks/active/TASK-compass-001_compass-feature.md)"
  - "[IMP Log](../../impl/implementation/2026-07-15_IMP_lint-fix-all.md)"
tags:
  - REV
  - review
  - lint
  - TASK-compass-001
---

# Review Log: Fix All Lint Errors

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。全11件の lint 問題（4 errors + 7 warnings）が正しく修正され、型エラーの回帰もない。

---

## Quality Gate Results

### `npx expo lint` — EXIT_CODE=0

```text
(出力なし — エラー・警告 0)
```

### `npx tsc --noEmit` — EXIT_CODE=2（既存エラーのみ）

```text
app.config.ts:30:5 - error TS2353: Object literal may only specify known properties, and 'jsEngine' does not exist in type 'ExpoConfig'.                        [既存]
src/features/home/map/components/MapContainer.tsx:34:7 - error TS2322: Type '((region: CameraRegion) => void) | undefined' is not assignable to type ...  [既存]

Found 2 errors in 2 files.
```

判定: ✅ 合格（2件とも既存エラー。本タスク起因ではない）

---

## Per-File Review

### 1. `src/features/home/map/config/categoryDisplayConfig.ts`

| 変更前 | 変更後 | 判定 |
|--------|--------|------|
| `import { ROOM_CATEGORIES, type RoomKey }` | `import { ROOM_CATEGORIES }` | ✅ OK |

- `RoomKey` はファイル内で 0 回使用 → 安全に削除可
- `ROOM_CATEGORIES` の値インポートは維持 → コンパイルエラーなし

### 2. `src/features/home/map/hooks/dataLoad/useBatchMapData.ts`

| 変更 | 理由 | 判定 |
|------|------|------|
| `prevFloorDataRef` (useRef) → `previousFloorData` (useState) | レンダー中の ref アクセス禁止対応 | ✅ OK |
| `currentFloorRef` (useRef) → `floor` prop 直接 | 同上 | ✅ OK |
| `prevRetryKeyRef` は維持 | レンダー中にアクセスしないので問題なし | ✅ OK |

**意味的等価性検証**:
- `prevFloorDataRef.current = newFloorData` → `setPreviousFloorData(newFloorData)`: React 18 の自動バッチングにより、同一 async コールバック内の6つの setState が1回の再レンダリングに統合される → 余分な再レンダリングなし
- `prevFloorDataRef.current = null` (retryKey 変更時) → `setPreviousFloorData(null)`: useEffect 内 → 1回の余分な再レンダリングが発生するが、`retryKey` 変更は稀な操作であり実用上の影響は軽微
- `currentFloor: currentFloorRef.current` → `currentFloor: floor`: `floor` は常に最新の prop 値であるため完全に等価

### 3. `src/features/home/map/layers/floor/unit/rooms/index.tsx`

| 変更前 | 変更後 | 判定 |
|--------|--------|------|
| `type { ColorTheme, RoomCategory }` | `type { ColorTheme }` | ✅ OK |

- `RoomCategory` はコメント内で1回言及されているのみ（コードでは未使用） → 安全に削除可

### 4. `src/features/home/map/renderers/labels/LabelConfigs.ts`

| # | 問題 | 修正 | 判定 |
|---|------|------|------|
| 1 | `colorPalette.ts` 重複インポート (3箇所) | `{ LIGHT_THEME, type RoomCategory, type ColorTheme }` に統合 | ✅ OK |
| 2 | `configs.ts` 重複インポート (2箇所) | `{ buildCategoryFilter, ROOM_CATEGORY_MAP }` に統合 | ✅ OK |
| 3 | `import { LIGHT_THEME }` が末尾 | 先頭の colorPalette 行に移動 | ✅ OK |

- 統合後のインポート構文は正しい
- すべてのシンボルがファイル内で使用されていることを確認済

### 5. `src/shared/components/bottomTabBar/useTabAnimatedValues.ts`

| 変更前 | 変更後 | 判定 |
|--------|--------|------|
| `useRef` + return `ref.current` | `useState` 遅延初期化 + return `values` | ✅ OK |

- `useState(() => ROUTES.map(...))` により、初回レンダリング時のみ配列が生成される → useRef と同様の stable reference
- 不要になった useRef/useEffect インポートも削除済

---

## Summary

| ファイル | Errors Fixed | Warnings Fixed | 回帰 |
|----------|-------------|---------------|------|
| `categoryDisplayConfig.ts` | 0 | 1 | なし |
| `useBatchMapData.ts` | 3 | 0 | なし |
| `rooms/index.tsx` | 0 | 1 | なし |
| `LabelConfigs.ts` | 0 | 5 | なし |
| `useTabAnimatedValues.ts` | 1 | 0 | なし |
| **合計** | **4** | **7** | **なし ✅** |

**最終判定**: ✅ 承認 — 全11件の lint 問題が修正され、回帰もない。コードの意味的等価性も担保されている。
