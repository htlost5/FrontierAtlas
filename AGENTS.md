<!-- このファイルは、自律エージェントが参照するビルド・テスト・品質確認・ドキュメント運用手順を定義するためのものです。 -->

# AGENTS.md

## 目的

このファイルは、FrontierAtlas でエージェントが自律実行するための標準手順を定義します。  
役割定義は `.github/agents/*.md`、共通規約は `.github/copilot-instructions.md` と `.github/instructions/*.instructions.md` を参照します。

## Build / Run コマンド（プラットフォーム別）

- 依存インストール: `npm install`
- 開発サーバ起動: `npx expo start`
- Android 実行: `npx expo start -a`
- iOS 実行（macOS 環境）: `npx expo start -i`
- Web 実行: `npx expo start -w`

## Test 実行コマンド

- 現状の自動テストスクリプト: 未定義（`package.json` に `test` script なし）
- 最低検証:
  - Lint: `npx expo lint`
- 将来 `test` script 追加時: `npm run test` を標準化する

## Lint / 型チェック

- Lint: `npx expo lint`
- 型チェック: `npx tsc --noEmit`
- 原則: コード変更時は Lint を実行し、エラーを解消してから完了する

## Deploy（運用時）

- EAS build（必要時）
  - Android: `eas build -p android`
  - iOS: `eas build -p ios`
- EAS update（必要時）
  - `eas update`

## Obsidian vault 設定

- Obsidian MCPをそのまま利用

## Notion ワークスペース構成方針

- 公式情報のみを記載し、開発中メモは含めない
- ページ分割単位
  - Platform（Android / Web）
  - Feature（map / search / settings など）
- 更新トリガー
  - 機能完成かつ運用可能と判断された時のみ
- 認証情報
  - データベース ID は機密として管理し、平文コミットしない

## 自律実行できる操作 / 要確認操作

### 自律実行してよい

- リポジトリ内ファイルの読取・編集（最小差分）
- Lint / 型チェック / ローカル検証コマンド実行
- ドキュメント（`.md`）更新
- Obsidian ノートの作成・更新・整理

### ユーザ確認が必要

- `git push`（例外なし）
- 依存追加・削除（`package.json` 変更を伴うもの）
- 破壊的変更（公開 API 変更、大規模リネーム、削除）
- 本番系外部サービス更新（Notion 本番 DB への大量更新を含む）
- デプロイ実行（EAS build/update を含む）
