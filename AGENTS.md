# AGENTS.md

## 目的

このファイルは、FrontierAtlas プロジェクト全体の構造を説明し、各サブプロジェクトのエージェント定義への誘導を目的とします。

---

## プロジェクト構造

このディレクトリ（`frontieratlas/`）は開発用のローカルワークスペースであり、**Git 管理下にありません**。

各サブプロジェクトは独立した Git リポジトリとして管理されています：

| ディレクトリ | リポジトリ |
|-------------|-----------|
| `mobile/` | [frontieratlas-app](https://github.com/htlost5/frontieratlas-app) - モバイルアプリ |
| `tools/` | [frontieratlas-geo-tools](https://github.com/htlost5/frontieratlas-geo-tools) - マップアセットパイプライン |

---

## サブプロジェクトの AGENTS.md

### mobile/

`mobile/AGENTS.md` を参照してください。ビルド・テスト・Lint 実行手順、依存関係トラブルシューティング、デプロイ手順などが定義されています。

エージェント定義ファイルは `mobile/.github/agents/*.md`、共通規約は `mobile/.github/copilot-instructions.md`、詳細指示は `mobile/.github/instructions/*.instructions.md` に配置されています。

→ [`mobile/AGENTS.md`](./mobile/AGENTS.md)

### tools/

現在 `tools/AGENTS.md` は存在しません。必要な場合は `tools/` の構成に応じて新規作成してください。

---

## エージェントタスクの開始方法

1. 対象サブプロジェクト（`mobile/` または `tools/`）の AGENTS.md を参照
2. 必要に応じてサブプロジェクトの `.github/` 配下のエージェント定義・指示ファイルを確認
