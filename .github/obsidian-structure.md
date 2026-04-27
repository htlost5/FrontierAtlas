<!-- このファイルは、Obsidian ノート構造の仕様メモを定義するためのものです。 -->

# Obsidian ノート構造定義（仕様メモ）

# 実際のノート作成・管理は MCP 経由で行う。ローカルへの直接書き込みは禁止。

obsidian/
│
├── _inbox/ # 【一時】エージェント間の受け渡し用（全エージェントが読み書き可）
│ ├── orchestrator-tasks/ # Orchestrator が書いたタスク指示ノート
│ ├── implementation-results/ # Implementation の実行結果ノート
│ ├── debugger-results/ # Debugger の解析結果ノート
│ ├── tester-results/ # Tester の実行結果ノート
│ └── reviewer-results/ # Reviewer のレビュー結果ノート
│
├── agent-rules/ # 【永久】エージェントの根幹ルール・動作定義（KM のみ書き込み可）
│ ├── orchestrator.md
│ ├── implementation.md
│ ├── debugger.md
│ ├── tester.md
│ ├── reviewer.md
│ └── knowledge-manager.md
│
├── implementation-log/ # 【永久】実装記録（KM のみ書き込み可）
│ └── YYYY-MM-DD_[feature-name].md
│
├── debug-log/ # 【永久】デバッグ記録（KM のみ書き込み可）
│ └── YYYY-MM-DD*[error-summary].md
│
├── review-log/ # 【永久】レビュー指摘・改善提案（KM のみ書き込み可）
│ └── YYYY-MM-DD*[review-target].md
│
├── agent-feedback/ # 【永久】AIエージェントへの指摘・改善メモ（KM のみ書き込み可）
│ └── YYYY-MM-DD\_[agent-name]-feedback.md
│
└── archive/ # 【永久】完了・クローズした inbox ノートの保管（KM のみ書き込み可）
└── YYYY-MM/

## ノート分類ルール

| 分類             | フォルダ              | 保持期間               | 読み取り権限   | 書き込み権限   |
| ---------------- | --------------------- | ---------------------- | -------------- | -------------- |
| 一時ノート       | `_inbox/`             | KM が整理するまで      | 全エージェント | 全エージェント |
| 根幹ルール       | `agent-rules/`        | 永久（追記・修正のみ） | 全エージェント | KM のみ        |
| 実装記録         | `implementation-log/` | 永久                   | 全エージェント | KM のみ        |
| デバッグ記録     | `debug-log/`          | 永久                   | 全エージェント | KM のみ        |
| レビュー指摘     | `review-log/`         | 永久                   | 全エージェント | KM のみ        |
| エージェント指摘 | `agent-feedback/`     | 永久                   | 全エージェント | KM のみ        |
| アーカイブ       | `archive/`            | 永久（参照専用）       | 全エージェント | KM のみ        |
