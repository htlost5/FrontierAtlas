<!-- このファイルは、Obsidian ノートの書き込みフォーマット仕様を定義するためのものです。 -->

# Obsidian ノート書き込みフォーマット定義（仕様メモ）

# 実際のノート作成・管理は MCP 経由で行う。ローカルへの直接書き込みは禁止。

## 一時ノート：指示ノート（`_inbox/orchestrator-tasks/`）

```markdown
---
type: task-instruction
created: { { YYYY-MM-DD HH:mm } }
orchestrator-session: { { セッションID } }
target-agent: { { Implementation | Debugger | Tester | Reviewer } }
status: pending
---

## タスク概要

{{タスクの概要}}

## 詳細指示

{{具体的な実行内容}}

## 完了条件

{{何をもって完了とするか}}

## 参照ノート

{{関連する永久ノートへのリンク（あれば）}}
```

## 一時ノート：結果ノート（`_inbox/[agent-name]-results/`）

```markdown
---
type: task-result
created: { { YYYY-MM-DD HH:mm } }
agent: { { エージェント名 } }
linked-instruction: { { 対応する指示ノートのパス } }
status: completed | blocked | partial
---

## 実行結果サマリー

## 成果物・変更内容

## 未解決事項・懸念点

## 次のエージェントへの引き継ぎ事項
```

## 永久ノート：実装記録（`implementation-log/`）

```markdown
---
type: implementation-log
date: { { YYYY-MM-DD } }
feature: { { 機能名 } }
linked-inbox: { { 元になった inbox ノートのパス } }
---

## 実装概要

## 変更ファイル一覧

## 設計上の判断・理由

## 残課題
```

## 永久ノート：デバッグ記録（`debug-log/`）

```markdown
---
type: debug-log
date: { { YYYY-MM-DD } }
error-summary: { { エラーの一言要約 } }
linked-inbox: { { 元になった inbox ノートのパス } }
---

## 発生したエラー・事象

## 原因分析

## 修正内容

## 再発防止策
```

## 永久ノート：エージェント指摘（`agent-feedback/`）

```markdown
---
type: agent-feedback
date: { { YYYY-MM-DD } }
target-agent: { { エージェント名 } }
severity: low | medium | high
---

## 指摘内容

## 発生したコンテキスト

## 改善提案

## 対応状況
```
