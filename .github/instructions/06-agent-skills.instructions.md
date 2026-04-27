<!-- このファイルは、Git/Notion/Obsidian のカテゴリ別補足ポリシーと参照導線を定義するためのものです。 -->

---

## applyTo: "\*\*"

# 開発記録 / 公式ドキュメント運用ポリシー

## 目的

- 完成済み情報と開発中情報を分離し、ドキュメント品質を維持する。
- 障害知見を再利用可能な形式で蓄積し、再発を抑止する。
- Git / Notion / Obsidian の運用責務を明確化する。

## 共通ポリシー

<!-- 変更: 旧設計から Obsidian 根幹中継モデル（分散アクセス型）へ移行 -->

- `git push` はユーザの明示的許可がある場合のみ実行する。
- Notion には完成済み・運用可能な公式情報のみ反映する。
- Obsidian には設計判断・障害解析・解決手順を構造化記録する。
- エージェント間の指示・依頼・結果共有は Obsidian `_inbox/` を経由し、直接通信しない。
- Obsidian `_inbox/` は全エージェントが読み書き可能とする。
- Obsidian 永久ノート（`agent-rules/` `implementation-log/` `debug-log/` `review-log/` `agent-feedback/` `archive/`）は全エージェントが読み取り可能、書き込みは `knowledge-manager` のみとする。
- Notion の読み取り・書き込みは `knowledge-manager` のみが実行する。

## 責務の所在

- エージェント別の実行フローと handoff は `.github/agents/*.md` に定義する。
- ビルド/テスト/型チェック/デプロイ/操作権限区分はルート `AGENTS.md` に定義する。

## 参照先

- [.github/agents/knowledge-manager.md](../agents/knowledge-manager.md)
- [.github/agents/orchestrator.md](../agents/orchestrator.md)
- [AGENTS.md](../../AGENTS.md)
