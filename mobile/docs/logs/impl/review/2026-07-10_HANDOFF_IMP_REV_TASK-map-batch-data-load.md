---
agent: IMP
task_id: TASK-map-batch-data-load
date: 2026-07-10
status: pending
category: log
destination: _inbox/
related:
  - "[REV レビュー成果物](2026-07-10_2354_REV_map-batch-load-review.md)"
  - "[IMP 実装ログ](../logs/impl/implementation/2026-07-10_IMP_critical1-dismiss-fix.md)"
tags:
  - IMP
  - handoff
  - code-review-fix
---

# HANDOFF: IMP → REV（CRITICAL-1 修正完了・再レビュー依頼）

## Metadata

| Field | Value |
|-------|-------|
| **From** | IMP (Implementer) |
| **To** | REV (Reviewer) |
| **Task ID** | TASK-map-batch-data-load |
| **Status** | **success** — CRITICAL-1 修正完了 |
| **Confidence** | high |
| **Handoff Type** | forward (再レビュー依頼) |

---

## Task Context（継承・追記セクション）

### Original Request

REV からの CRITICAL 差し戻しに対応。`handleDismiss` が `handleRetry` と同一実装（`setRetryCount(c => c + 1)`）になっている動作バグを修正する。

### Constraints

- dismiss は前フロアのデータを維持したままエラーバナーを非表示にする（retry は全キャッシュリセット＋再フェッチ）
- `errorDismissed` は `floor` または `retryKey` 変更時に自動リセットする

### Chain History

| Step | Agent | Status | Summary |
|------|-------|--------|---------|
| 1 | DEV | done | 要件定義 |
| 2 | ARC | done | アーキテクチャ設計 |
| 3 | IMP | done | 初回実装 |
| 4 | REV | done | レビュー — **1 CRITICAL 差し戻し** |
| 5 | IMP | **done** | **← 今回: CRITICAL-1 修正** |
| 6 | REV | *pending* | 再レビュー |

---

## Key Findings / Decisions

### 修正内容

1. **`errorDismissed` state 導入**: dismiss 用の独立した `boolean` state を追加
2. **`useEffect` リセット**: `floor` / `retryCount` 変更時に `setErrorDismissed(false)` で自動リセット
3. **`handleDismiss` 実装修正**: `setErrorDismissed(true)` に変更し、`retryCount` を操作しない
4. **ErrorOverlay 表示条件**: `batchData.floorError && !errorDismissed` に修正
5. **CONDITIONAL-1 修正（ついで対応）**: 初回エラー時の冗長な二重キャストを簡略化

### 未対応の Conditional 項目

| # | 内容 | 理由 |
|---|------|------|
| CONDITIONAL-2 | catch の error 型アサーション | P1 — 防御的改善、動作影響なし |
| CONDITIONAL-3 | `as BatchState` キャスト | P3 — 型安全上の妥協、runtime 影響なし |
| CONDITIONAL-4 | MapView children overlay | P2 — 実機確認が必要 |
| CONDITIONAL-5 | 不要在レンダリング | P4 — `React.memo` 有無に依存 |

---

## Artifacts

| Path | Type | Description |
|------|------|-------------|
| `mobile/src/features/home/map/MapScreen.tsx` | source | CRITICAL-1 + CONDITIONAL-1 修正 |
| `logs/impl/implementation/2026-07-10_IMP_critical1-dismiss-fix.md` | log | 実装ログ |

---

## Open Questions

なし（修正方針は REV の指摘に従ったため）

---

## Routing

| Field | Value |
|-------|-------|
| **Next Agent** | REV |
| **Blockers** | none |
| **Priority** | high |
| **Deadline** | — |

---

## Role-Specific Output

### Changed Files

| File | 変更概要 |
|------|----------|
| `mobile/src/features/home/map/MapScreen.tsx` | 4箇所修正（import追加, state追加, dismiss修正, overlay条件修正, CONDITIONAL-1簡略化） |

### Build Result

- ✅ TypeScript コンパイルエラー: 0件
- 実機ビルド未実施（コード変更のみ）
