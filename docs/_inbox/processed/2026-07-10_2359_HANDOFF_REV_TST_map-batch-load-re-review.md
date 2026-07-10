---
agent: REV
task_id: TASK-map-batch-data-load
date: 2026-07-10
status: approved
category: log
destination: _inbox/
related:
  - "[IMP 修正済み] MapScreen.tsx"
  - "[前回レビュー] _inbox/2026-07-10_2354_REV_map-batch-load-review.md"
tags:
  - REV
  - handoff
  - code-review
  - re-review
---

# HANDOFF: REV → TST

## Metadata
| Field | Value |
|-------|-------|
| **From** | REV (Reviewer) |
| **To** | TST (Tester) |
| **Task ID** | TASK-map-batch-data-load |
| **Status** | **success** — Conditional Approval |
| **Confidence** | high |
| **Handoff Type** | forward |

---

## Task Context（継承・追記セクション）

### Original Request
マップデータ一括ロード実装のコードレビュー。6ソースの GeoJSON データを `Promise.all` で一括取得し、全成功時のみ MapLibre `MapView` をマウントする「一括ロード→一括描画」方式への再設計を検証。

### Constraints
- 初回ロード中は `MapContainer`（MapView）をレンダリングしない
- 全6ソース `Promise.all` 一括取得成功時のみ描画（All-or-Nothing）
- フロア切替時、floor 非依存データ（venue, buildings, stairs）は再取得しない
- フロア切替中は前フロアのデータを表示し続ける（stale-while-revalidate）
- `AbortController` で race condition 防止
- hooks の呼び出し順が条件分岐で変わらないこと

### Chain History
| Step | Agent | Status | Summary |
|------|-------|--------|---------|
| 1 | IMP | done | 一括ロード実装（useBatchMapData, FullScreenLoading, ErrorOverlay, MapScreen） |
| 2 | REV | done (1st) | 1 CRITICAL（handleDismiss 動作バグ）+ 5 Conditionals を指摘 |
| 3 | IMP | done (fix) | CRITICAL-1 修正 + CONDITIONAL-1 修正を `MapScreen.tsx` に適用 |
| 4 | **REV** | **done (re-review)** | ✅ 修正確認 → Conditional Approval |

---

## Key Findings / Decisions

### ◆ CRITICAL-1 修正確認

| 確認項目 | 結果 | 詳細 |
|---------|------|------|
| `handleDismiss` が retry と分離 | ✅ 合格 | `setErrorDismissed(true)` のみ。`handleRetry` は `setRetryCount` のままで独立 |
| `errorDismissed` state 追加 | ✅ 合格 | `useState(false)` で初期化、ErrorOverlay の表示条件に `!errorDismissed` 追加 |
| `floor`/`retryCount` 変更時に自動リセット | ✅ 合格 | `useEffect([floor, retryCount])` で依存配列設定。新しいフロアではエラーバナーが再表示される |
| 既存動作への干渉なし | ✅ 合格 | hooks 呼び出し順・レンダリングロジック・state 遷移に影響なし |

### ◆ CONDITIONAL-1 修正確認

| 確認項目 | 結果 |
|---------|------|
| 内側の冗長な `status === "error"` 判定が削除 | ✅ 合格 |
| 不要な `as Extract<...>` キャストが削除され `state.error.message` に単純化 | ✅ 合格 |

### ◆ 残 Conditional 項目（未修正・許容範囲）

| # | 項目 | 重大度 | 判断 |
|---|------|--------|------|
| CONDITIONAL-2 | catch の `e as Error` 型アサーション | 低 | 通常は Error が throw される前提で実害なし |
| CONDITIONAL-3 | `as BatchState` キャスト | 低 | runtime 影響なし |
| CONDITIONAL-4 | MapView children の overlay 表示 | 中 | 実機確認が必要だが TST 工程で検証可能 |
| CONDITIONAL-5 | フロア切替中の不要再レンダリング | 低 | `React.memo` 適用有無次第。perf 懸念は軽微 |

### ◆ アーキテクチャ要件適合マトリクス（再確認）

| # | 要件 | 結果 |
|---|------|------|
| R1 | 初回ロード中は MapContainer 非マウント | ✅ |
| R2 | 全6ソース `Promise.all` 一括取得成功時のみ描画 | ✅ |
| R3 | floor 非依存データはキャッシュで再取得しない | ✅ |
| R4 | フロア切替中は前フロアデータを表示 | ✅ |
| R5 | `AbortController` で race condition 防止 | ✅ |
| R6 | `MapIconLabel` に `batchData.currentFloor` が渡される | ✅ |
| R7 | 一部取得失敗時は全体エラー、部分描画しない | ✅ |
| R8 | `getGeoDataByLogicalId` シグネチャ変更なし | ✅ |

### ◆ Hooks 呼び出し順チェック（変更なし）

```
useMapContext()         → line 26
useDisplayLevel(zoom)   → line 27
useState(0)             → line 31
useState(false)         → line 33   ← NEW: errorDismissed
useBatchMapData(...)    → line 34
useEffect               → line 36   ← NEW: dismiss reset
useCallback (retry)     → line 38
useCallback (dismiss)   → line 41
useRef (prevZoomRef)    → line 43
useCallback (region)    → line 44
```

全ての hooks は early return 前に呼び出されており、呼び出し順の変動なし ✅

---

## Artifacts

| Path | Type | Description |
|------|------|-------------|
| `_inbox/2026-07-10_2359_HANDOFF_REV_TST_map-batch-load-re-review.md` | handoff | 再レビュー結果・TST への forward |
| `_inbox/2026-07-10_2354_REV_map-batch-load-review.md` | review | 一次レビュー成果物 |
| `mobile/src/features/home/map/MapScreen.tsx` | code | CRITICAL-1 + CONDITIONAL-1 修正済み |

---

## Open Questions

1. CONDITIONAL-4（MapLibre children overlay）は TST 工程での実機視認確認を推奨
2. CONDITIONAL-2〜5 はバグではないため、任意対応。スケジュール優先ならスキップ可能

---

## Routing

| Field | Value |
|-------|-------|
| **Next Agent** | **TST** |
| **Blockers** | なし |
| **Priority** | high |
| **Deadline** | — |

---

## Role-Specific Output

### Review Result

| 判定 | ✅ **Conditional Approval — TST へ forward** |
|------|------|
| **CRITICAL** | 0件（1件修正確認済み） |
| **Conditional** | 4件残存（CONDITIONAL-2〜5）— 全て軽微、ブロッカーなし |
| **修正確認** | CRITICAL-1 ✅ / CONDITIONAL-1 ✅ |

### 推奨フロー

**REV（再レビュー完了）→ TST（テスト実行）→ REL（リリース）**

1. TST がテスト実行
2. 実機での CONDITIONAL-4（MapView children overlay）表示確認を推奨
3. テスト合格後、REL がリリース
