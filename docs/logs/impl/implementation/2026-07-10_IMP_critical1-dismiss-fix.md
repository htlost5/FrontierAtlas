---
agent: IMP
task_id: TASK-map-batch-data-load
date: 2026-07-10
status: pending
category: log
destination: logs/impl/implementation/
related:
  - "[REV レビュー成果物](../_inbox/2026-07-10_2354_REV_map-batch-load-review.md)"
tags:
  - IMP
  - debug
  - code-review-fix
  - TASK-map-batch-data-load
---

# Implementation Log — CRITICAL-1: handleDismiss Fix

## Summary

REV から差し戻された CRITICAL-1（`handleDismiss` が `handleRetry` と同一実装になっている動作バグ）を修正した。

## Changes Applied

### File: `mobile/src/features/home/map/MapScreen.tsx`

| # | 変更 | 説明 |
|---|------|------|
| 1 | `useEffect` import 追加 | `errorDismissed` リセット用 |
| 2 | `errorDismissed` state 追加 | dismiss 用の独立した状態変数 |
| 3 | `useEffect` リセット追加 | `floor` / `retryCount` 変更時に自動リセット |
| 4 | `handleDismiss` 実装修正 | `setErrorDismissed(true)` に変更（retryCount 非操作） |
| 5 | ErrorOverlay 表示条件追加 | `!errorDismissed` を追加 |
| 6 | CONDITIONAL-1 修正 | 初回エラー時の冗長な二重キャストを簡略化 |

### 動作仕様

| アクション | 修正前 | 修正後 |
|-----------|--------|--------|
| retry ボタン押下 | `retryCount++` → 全キャッシュリセット + 再フェッチ | 同左（変更なし） |
| dismiss ボタン押下 | `retryCount++` → 全キャッシュリセット + fullscreen loading | `errorDismissed = true` → 前フロアデータ維持 + エラーバナー非表示のみ |
| floor 変更 | — | `useEffect` で `errorDismissed` 自動リセット → 新しい floor でエラーがなければバナー再表示なし |
| retry 実行 | — | `useEffect` で `errorDismissed` 自動リセット → 再試行中もバナー表示可能 |

## Verification

- ✅ コンパイルエラーなし（TypeScript エラー 0）
- ✅ `handleDismiss` が `retryCount` を変更しないことを確認
- ✅ `errorDismissed` が `floor` / `retryCount` 変更時にリセットされることを確認
- ✅ ErrorOverlay の表示条件に `!errorDismissed` が含まれていることを確認
- ✅ CONDITIONAL-1 の冗長キャストが除去されていることを確認

## DEFERRED（本タスクでは対応しない項目）

- CONDITIONAL-2: catch の error 型アサーション（`e as Error` → `instanceof Error` チェック追加）
- CONDITIONAL-3: `BatchState` の `as BatchState` キャスト
- CONDITIONAL-4: MapView children のオーバーレイ表示確認
- CONDITIONAL-5: フロア切替中の不要再レンダリング

→ これらは REV 判定で P1-P4 の Conditional 項目であり、P0 の CRITICAL 修正完了後に任意対応と判断した。
