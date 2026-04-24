# FrontierAtlas Instruction Index

このディレクトリは、`.github/copilot-instructions.md` を補完する**パス別ルール**です。

## 読み込み方針

- 共通ルール: `00-core.instructions.md`（`applyTo: "**"`）
- 以降は、編集対象パスに一致するファイルだけが適用されます。

## ファイル一覧

1. `00-core.instructions.md`
   - 全体共通の最優先ルール（優先順位/MUST/MUST NOT）
2. `01-architecture.instructions.md`
   - レイヤ責務、依存方向、設計維持
3. `02-typescript.instructions.md`
   - TS/React命名、型安全、Hook規約
4. `03-data-network.instructions.md`
   - 通信、完全性検証、エラー型、registry
5. `04-ui-map.instructions.md`
   - UI/Map責務、状態管理、再レンダリング抑制
6. `05-quality.instructions.md`
   - lint必須、検証観点、テスト導入優先度

## 更新ルール

- 既存ファイルが 200 行超または責務が混在したら分割を検討する。
- ルール変更時は `.github/copilot-instructions.md` の更新ログにも要点を追記する。
