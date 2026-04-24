# FrontierAtlas Copilot Instructions（Global Entry Point）

## 目的

このファイルは、FrontierAtlas リポジトリにおける Copilot / エージェント実行の共通入口です。  
詳細ルールは `.github/instructions/*.instructions.md` に分割済みのため、ここでは全タスク共通の最小ルールと導線のみを定義します。

## プロジェクト概要（要約）

FrontierAtlas は、学内・施設向けの IMDF GeoJSON を表示する Expo 55 ベースの React Native アプリです。  
`app/` の Expo Router で画面を構成し、`src/features/home/map` で地図 UI、`src/data/geojson` で差分更新・フォールバック、`src/infra` で I/O を扱います。  
地図データは remote 取得時に `size` と `sha256` を検証し、失敗時は asset fallback を行う設計です。  
TypeScript `strict` と ESLint（expo lint）を前提に、Android / iOS / Web を対象として運用します。

## 優先順位（競合時）

1. 実際のコード（現状実装）
2. `.github/instructions/*.instructions.md`（対象パスに一致するもの）
3. 本ファイル（グローバル共通）
4. 一般ベストプラクティス

補足: 指示セット同士の矛盾を避ける。重複記述より、参照先を明示する。

## エージェント共通行動ルール

- 変更前に必ず次の順で現状を確認する: `app/` → `src/features/home/map` → `src/data/geojson` → `src/infra`。
- 着手前に、編集対象パスに対応する `.github/instructions/*.instructions.md` を読む。
- 曖昧な要求は、破壊的変更の恐れがある場合のみ停止して確認する。それ以外は既存実装と命名規約に合わせて最小差分で進める。
- 既存 API・依存方向・Context ガード（`if (!ctx) throw`）を尊重し、不必要なリネームや再構成を避ける。
- UI 層で直接ファイル I/O / ネットワーク処理をしない。必要な処理は data/infra 層経由で扱う。
- remote データは検証（`size` / `sha256`）を前提とし、検証抜き反映を行わない。
- 生成ファイル `src/data/geojson/geojsonAssetMap.ts` は手編集しない。
- 変更後は最低 `npm run lint` を実行し、失敗時は修正してから完了する。
- 出力は簡潔に、原則日本語。実装報告は「結論 → 根拠 → 影響範囲」を基本形とする。
- セキュリティ / プライバシー制約: 機密情報の直書き・露出、allowlist 外 URL の導入、機密情報を含む例外メッセージを避ける。

## 実行の既定手順（共通）

- 変更前に関連 instructions と実コードを確認し、重複探索を避ける。
- 変更は最小差分で実施し、不必要な rename / reformat をしない。
- 可能な限りローカルで検証し、最低限 `npm run lint` を通す。
- 失敗した検証は、原因と再現手順を短く記録してから修正する。
- 作業完了時は、変更理由と影響範囲をファイル単位で報告する。

## 停止して確認すべき条件

- データ破壊、仕様変更、公開 API 変更を伴う可能性がある場合。
- 依存追加や設定変更が、複数レイヤへ波及する場合。
- 既存 instruction 同士で解釈衝突があり、優先順位で解消できない場合。

## Instructions Index（必読）

各ドメインのタスクに着手する前に、該当ファイルを必ず読み込むこと。

- `.github/instructions/00-core.instructions.md` — 全体共通の最優先ルール（MUST / MUST NOT / 実装報告スタイル）
- `.github/instructions/01-architecture.instructions.md` — レイヤ責務、依存方向、設計分離の維持
- `.github/instructions/02-typescript.instructions.md` — TypeScript / React 命名、型安全、Hook 規約
- `.github/instructions/03-data-network.instructions.md` — 通信リトライ、完全性検証、エラー型、registry 更新
- `.github/instructions/04-ui-map.instructions.md` — UI / Map 層の責務、状態管理、再レンダリング抑制
- `.github/instructions/05-quality.instructions.md` — 品質ゲート（lint 必須）とレビュー観点
- `.github/instructions/INDEX.instructions.md` — 分割ルール全体の索引と運用補足

## 実行時チェック（軽量）

- 変更対象に一致する instruction を確認したか
- 生成ファイルを編集していないか
- 依存方向と fallback / 検証仕様を壊していないか
- `npm run lint` を通したか

## スコープ外（このファイルで扱わない内容）

- レイヤ別の詳細規約、TypeScript 詳細、Map UI 実装細則、データ更新詳細は個別 instruction に委譲する。
- 特定タスク専用の手順書はここに追記しない（必要なら `.github/prompts/` か対象 instruction へ追加する）。

## 外部ベストプラクティス反映メモ（要点）

- GitHub Docs の推奨に合わせ、`copilot-instructions.md` はリポジトリ全体の常時指示に限定する。
- パス別規約は `*.instructions.md` に分離し、重複より参照を優先する。
- 指示は task-specific にせず、短く保守可能な形で維持する。

## 更新方針

- ルール追加はまず `.github/instructions/` 側へ行い、本ファイルは入口として要約のみ維持する。
- 重大な構成変更時のみ、この概要とインデックスを更新する。
