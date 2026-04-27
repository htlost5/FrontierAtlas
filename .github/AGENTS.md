<!-- このファイルは、.github 配下のエージェント連携フローを定義するためのものです。 -->

<!-- 変更: 旧設計から Obsidian 根幹中継モデル（分散アクセス型）へ移行 -->

# .github エージェント連携フロー（Obsidian 根幹中継モデル）

## 連携原則

- エージェント間の直接通信を行わず、指示・中間ログ・結果はすべて Obsidian `_inbox/` を経由する。
- `_inbox/` は全エージェントが読み書き可能とする。
- Obsidian 永久ノート群は全エージェントが読み取り可能、書き込みは Knowledge Manager のみとする。
- Notion への正式ドキュメント化は Knowledge Manager のみが実行する。

## フロー図

```mermaid
flowchart TD
    ORC[Orchestrator]
    IMP[Implementation]
    DBG[Debugger]
    TST[Tester]
    REV[Reviewer]
    KM[Knowledge Manager]
    OBS_INB[("Obsidian\n_inbox/\n全エージェント読み書き可")]
    OBS_PERM[("Obsidian\n永久ノート群\nKM のみ書き込み可")]
    NOT[Notion\nKM のみ]

    ORC -->|MCP: 指示ノート書き込み| OBS_INB
    OBS_INB -->|MCP: 指示ノート読み込み| IMP
    OBS_INB -->|MCP: 指示ノート読み込み| DBG
    OBS_INB -->|MCP: 指示ノート読み込み| TST
    OBS_INB -->|MCP: 指示ノート読み込み| REV
    IMP -->|MCP: 結果ノート書き込み| OBS_INB
    DBG -->|MCP: 結果ノート書き込み| OBS_INB
    TST -->|MCP: 結果ノート書き込み| OBS_INB
    REV -->|MCP: 結果ノート書き込み| OBS_INB
    OBS_INB -->|MCP: 結果ノート読み込み| ORC

    OBS_INB -->|ユーザー指示によりトリガー| KM
    KM -->|MCP: 整理・昇格・構造化| OBS_PERM
    KM -->|MCP: 正式ドキュメント化| NOT
```

## 補足

- ノート構造仕様は [.github/obsidian-structure.md](obsidian-structure.md) を参照する。
- ノート書き込みフォーマットは [.github/obsidian-note-format.md](obsidian-note-format.md) を参照する。
- MCP サーバー未設定時は、各エージェント定義の「MCP サーバー未設定時の扱い」に従い、コメント明記のうえ当該操作をスキップする。
