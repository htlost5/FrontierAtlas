<!-- このファイルは、FrontierAtlas 全体に常時適用される Copilot グローバル方針（技術スタック・共通規約・参照導線）を定義するためのものです。 -->

# FrontierAtlas Copilot Instructions（Global Entry Point）

## 目的

このファイルは、FrontierAtlas リポジトリにおける Copilot の全体共通方針を定義します。  
詳細なカテゴリ別ルールは `.github/instructions/*.instructions.md`、エージェント固有の実行フローは `.github/agents/*.md` を参照してください。

## 技術スタック（常時参照）

- Runtime / Framework: Expo 55, React Native 0.83, React 19, Expo Router
- Language: TypeScript（`strict` 前提）
- Map Engine:
  - Android: `@maplibre/maplibre-react-native`
  - Web: `maplibre-gl`（TypeScript）
- Data Handling: IMDF GeoJSON（remote 取得 + `size` / `sha256` 検証 + asset fallback）
- Quality Gate: ESLint（`npm run lint`）

## コーディング規約（全体共通）

- 命名・型安全・Hook 規約は `02-typescript.instructions.md` に準拠する。
- UI 層の責務分離、データ検証、依存方向は対象 instruction に準拠する。
- 生成ファイル `src/data/geojson/geojsonAssetMap.ts` は手編集しない。
- 既存 API・命名・依存方向を尊重し、不要なリネームや再構成を避ける。
- 変更報告は「結論 → 根拠 → 影響範囲」を基本とし、日本語で簡潔に記述する。

## 優先順位（競合時）

1. 実際のコード（現状実装）
2. `.github/instructions/*.instructions.md`（対象パス一致）
3. 本ファイル（グローバル共通）
4. 一般ベストプラクティス

## Instructions 参照導線

- [.github/instructions/00-core.instructions.md](./instructions/00-core.instructions.md)
- [.github/instructions/01-architecture.instructions.md](./instructions/01-architecture.instructions.md)
- [.github/instructions/02-typescript.instructions.md](./instructions/02-typescript.instructions.md)
- [.github/instructions/03-data-network.instructions.md](./instructions/03-data-network.instructions.md)
- [.github/instructions/04-ui-map.instructions.md](./instructions/04-ui-map.instructions.md)
- [.github/instructions/05-quality.instructions.md](./instructions/05-quality.instructions.md)
- [.github/instructions/06-agent-skills.instructions.md](./instructions/06-agent-skills.instructions.md)
- [.github/instructions/INDEX.instructions.md](./instructions/INDEX.instructions.md)

## Agents 参照導線

- [.github/agents/orchestrator.md](./agents/orchestrator.md) — タスク分解・委譲・結果統合
- [.github/agents/implementation.md](./agents/implementation.md) — 実装担当
- [.github/agents/debugger.md](./agents/debugger.md) — 原因分析・修正案提示担当
- [.github/agents/tester.md](./agents/tester.md) — テスト設計・実行担当
- [.github/agents/reviewer.md](./agents/reviewer.md) — 品質レビュー担当
- [.github/agents/knowledge-manager.md](./agents/knowledge-manager.md) — Obsidian / Notion 記録担当

## 補足

- ビルド・テスト・Lint・型チェック・デプロイ手順はルートの [AGENTS.md](../AGENTS.md) を参照する。
- ワークフロー制御（どのエージェントが何を担当するか）は `.github/agents/*.md` にのみ定義する。
