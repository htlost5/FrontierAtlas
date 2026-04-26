<!-- このファイルは、Git/Notion/Obsidian のカテゴリ別補足ポリシーと参照導線を定義するためのものです。 -->

---

## applyTo: "\*\*"

# 開発記録 / 公式ドキュメント運用ポリシー

## 目的

- 完成済み情報と開発中情報を分離し、ドキュメント品質を維持する。
- 障害知見を再利用可能な形式で蓄積し、再発を抑止する。
- Git / Notion / Obsidian の運用責務を明確化する。

## 共通ポリシー

- `git push` はユーザの明示的許可がある場合のみ実行する。
- Notion には完成済み・運用可能な公式情報のみ反映する。
- Obsidian には設計判断・障害解析・解決手順を構造化記録する。
- Obsidian / Notion の MCP 操作は `knowledge-manager` のみが直接実行し、他エージェントは必ず委譲する。

## 責務の所在

- エージェント別の実行フローと handoff は `.github/agents/*.md` に定義する。
- ビルド/テスト/型チェック/デプロイ/操作権限区分はルート `AGENTS.md` に定義する。

## 参照先

- [.github/agents/knowledge-manager.md](../agents/knowledge-manager.md)
- [.github/agents/orchestrator.md](../agents/orchestrator.md)
- [AGENTS.md](../../AGENTS.md)
