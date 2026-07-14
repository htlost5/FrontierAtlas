---
agent: REV
task_id: TASK-compass-001
date: 2026-07-14
status: pending
category: shared
destination: shared/impl/specs/interfaces/
related:
  - "[REV Log](../logs/impl/review/2026-07-14_REV_breakpoints-inset.md)"
tags:
  - REV
  - TST
  - handoff
  - TASK-compass-001
---

# HANDOFF: REV → TST

## Task Context (継承)

**breakpoints inset 方式への変更**

IMP が以下を変更:
1. `mapConfig.ts` — `breakpoints` を `{ zoom, ne, sw }` → `{ zoom, inset }` に変更
2. `boundsBound.ts` — `insetToBounds()` 関数を追加し、inset から動的に ne/sw を計算

---

## REV 判定

| 項目 | 値 |
|------|-----|
| 判定 | ✅ 承認（条件付き） |
| 確信度 | high |
| CRITICAL | 0件 |

---

## 変更ファイル

| ファイル | 変更内容 |
|----------|----------|
| `mobile/src/features/home/map/constants/mapConfig.ts` | breakpoints の型変更 |
| `mobile/src/features/home/map/hooks/camera/useCameraController/boundsBound.ts` | insetToBounds() 追加 |

---

## 軽微な改善提案（試験対象外）

| # | 内容 |
