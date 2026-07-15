---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-15
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-001](../../../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - IMP
  - implementation
  - lint
  - TASK-compass-001
---

# Implementation Log: Fix All Lint Errors

## 実施内容

Expo プロジェクトの全 lint エラー・警告を修正。4 errors, 7 warnings をすべて解消。

---

## 初回 `npx expo lint` 出力（修正前）

```
D:\htlost5-workspace\projects\frontieratlas\mobile\src\features\home\map\config\categoryDisplayConfig.ts
  4:32  warning  'RoomKey' is defined but never used  @typescript-eslint/no-unused-vars

D:\htlost5-workspace\projects\frontieratlas\mobile\src\features\home\map\hooks\dataLoad\useBatchMapData.ts
  294:41  error  Error: Cannot access refs during render
  303:10  error  Error: Cannot access refs during render
  308:19  error  Error: Cannot access refs during render

D:\htlost5-workspace\projects\frontieratlas\mobile\src\features\home\map\layers\floor\unit\rooms\index.tsx
  8:3  warning  'RoomCategory' is defined but never used  @typescript-eslint/no-unused-vars

D:\htlost5-workspace\projects\frontieratlas\mobile\src\features\home\map\renderers\labels\LabelConfigs.ts
    3:35  warning  'colorPalette.ts' imported multiple times           import/no-duplicates
    4:33  warning  'colorPalette.ts' imported multiple times           import/no-duplicates
    5:37  warning  'configs.ts' imported multiple times                import/no-duplicates
    7:35  warning  'configs.ts' imported multiple times                import/no-duplicates
  109:1   warning  Import in body of module; reorder to top            import/first

D:\htlost5-workspace\projects\frontieratlas\mobile\src\shared\components\bottomTabBar\useTabAnimatedValues.ts
  18:10  error  Error: Cannot access refs during render

✖ 11 problems (4 errors, 7 warnings)
  0 errors and 3 warnings potentially fixable with the `--fix` option.
```

---

## 修正内容

### 1. `src/features/home/map/config/categoryDisplayConfig.ts`

| ファイル行 | 種別 | 内容 | 対応 |
|---|---|---|---|
| 4:32 | warning | `RoomKey` が未使用 | 未使用の `RoomKey` 型インポートを削除（`ROOM_CATEGORIES` の値インポートは維持） |

**変更**: `import { ROOM_CATEGORIES, type RoomKey }` → `import { ROOM_CATEGORIES }`

---

### 2. `src/features/home/map/hooks/dataLoad/useBatchMapData.ts`

| ファイル行 | 種別 | 内容 | 対応 |
|---|---|---|---|
| 294:41 | error | レンダー中の ref アクセス（`prevFloorDataRef.current`） | `prevFloorDataRef` を廃止し、`previousFloorData` ステートに置き換え。データ取得完了時に `setPreviousFloorData(newFloorData)` で更新し、レンダー時は `floorData ?? previousFloorData` で参照 |
| 303:10 | error | レンダー中の ref アクセス（return 文全体） | 同上 |
| 308:19 | error | レンダー中の ref アクセス（`currentFloorRef.current`） | `currentFloorRef` を廃止し、`floor` prop を直接 return |

**変更詳細**:
- `const prevFloorDataRef = useRef<FloorGeoData | null>(null)` → 削除
- `const currentFloorRef = useRef<number>(floor)` → 削除
- `const [previousFloorData, setPreviousFloorData] = useState<FloorGeoData | null>(null)` → 追加
- Effect 内: `prevFloorDataRef.current = newFloorData; currentFloorRef.current = floor` → `setPreviousFloorData(newFloorData)`
- retryKey リセット時: `prevFloorDataRef.current = null` → `setPreviousFloorData(null)`
- return: `currentFloor: currentFloorRef.current` → `currentFloor: floor`
- return: `floorData: displayFloorData` → 変更なし（`displayFloorData` が `previousFloorData` を参照）

---

### 3. `src/features/home/map/layers/floor/unit/rooms/index.tsx`

| ファイル行 | 種別 | 内容 | 対応 |
|---|---|---|---|
| 8:3 | warning | `RoomCategory` が未使用 | 未使用の `RoomCategory` 型インポートを削除 |

**変更**: `import type { ColorTheme, RoomCategory }` → `import type { ColorTheme }`

---

### 4. `src/features/home/map/renderers/labels/LabelConfigs.ts`

| ファイル行 | 種別 | 内容 | 対応 |
|---|---|---|---|
| 3:35 | warning | `colorPalette.ts` 重複インポート | 3行の別々の import を統合: `import { LIGHT_THEME, type RoomCategory, type ColorTheme }` |
| 4:33 | warning | `colorPalette.ts` 重複インポート | 同上 |
| 5:37 | warning | `configs.ts` 重複インポート | `buildCategoryFilter` と `ROOM_CATEGORY_MAP` を1行に統合 |
| 7:35 | warning | `configs.ts` 重複インポート | 同上 |
| 109:1 | warning | import がファイル末尾にある | `LIGHT_THEME` の import を先頭に移動 |


**変更詳細**:
- `import type { RoomCategory } from "...colorPalette"` + `import type { ColorTheme } from "...colorPalette"` → 統合
- `import { buildCategoryFilter } from "...configs"` + `import { ROOM_CATEGORY_MAP } from "...configs"` → 統合
- 末尾の `import { LIGHT_THEME }` → 先頭の `colorPalette` インポート行に統合

---

### 5. `src/shared/components/bottomTabBar/useTabAnimatedValues.ts`

| ファイル行 | 種別 | 内容 | 対応 |
|---|---|---|---|
| 18:10 | error | レンダー中の ref アクセス（`ref.current`） | `useRef` + `useEffect` を `useState` の初期化子関数に置き換え |

**変更詳細**:
- `const ref = React.useRef<Animated.Value[]>(ROUTES.map(...))` + `useEffect` → `const [values] = React.useState<Animated.Value[]>(() => ROUTES.map(...))`
- `return ref.current` → `return values`

---

## 最終 `npx expo lint` 出力（修正後）

```
EXIT_CODE=0
```

**0 errors, 0 warnings.** 全件クリア。

---

## TypeScript 型チェック結果

`npx tsc --noEmit` で2件のエラーが検出されたが、いずれも本タスクとは無関係の既存エラー。

| ファイル | エラー内容 | 判定 |
|---|---|---|
| `app.config.ts:30` | `jsEngine` プロパティが `ExpoConfig` 型に存在しない | [既存] |
| `MapContainer.tsx:34` | `onRegionIsChanging` の型不一致（`CameraRegion` vs `RegionPayloadFeature`） | [既存] |

---

## 品質チェック

- [x] `npx expo lint` — 0 errors, 0 warnings
- [x] `npx tsc --noEmit` — 既存エラーのみ（本タスク起因ではない）
- [x] 未使用インポートの削除 — コンパイルエラーなし
- [x] react-hooks/rules-of-hooks — フック呼び出し順序変更なし
- [x] ロジック変更の最小化 — 挙動に影響しない範囲で修正

---

## 修正ファイル一覧

| ファイル | 変更内容 |
|---|---|
| `src/features/home/map/config/categoryDisplayConfig.ts` | 未使用 `RoomKey` インポート削除 |
| `src/features/home/map/hooks/dataLoad/useBatchMapData.ts` | ref → state 置き換え（3件の ESLint error 修正） |
| `src/features/home/map/layers/floor/unit/rooms/index.tsx` | 未使用 `RoomCategory` インポート削除 |
| `src/features/home/map/renderers/labels/LabelConfigs.ts` | 重複インポート統合・import 順修正（5件の warning 修正） |
| `src/shared/components/bottomTabBar/useTabAnimatedValues.ts` | ref → state 置き換え（1件の ESLint error 修正） |

---

## 懸念点

- `useBatchMapData.ts` の `previousFloorData` は state となったため、DataFetch完了→setPreviousFloorData→re-render のタイミングで余分な再レンダリングが1回増える。ただし SWRパターンはレンダリング後に実行される effect 内で更新されるため、実用上の影響は軽微。
- `useTabAnimatedValues.ts` で `useState` に変更したが、`Animated.Value` インスタンスはコンポーネントのライフサイクルを通じて安定するため、機能的に問題なし。
