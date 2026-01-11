# Copilot Instructions for FrontierAtlas App (Cross-Platform)

## このドキュメントについて

- Github Copilot や各種AIツールが本リポジトリのコンテキストを理解しやすくするためのガイドです。
- 新しい機能を実装する際や、修正を加える際はここで示す技術選定・設計方針・モジュール構成を前提にしてください
- 不確かな点がある場合は、リポジトリのファイルを探索し、ユーザーに「こういうことですか？」と確認してください

## 前提条件

- 回答は必ず日本語でしてください
- なにか大きい変更を加える場合、まず何をするのか計画を立てた上で、ユーザーに「このような計画で進めようと思います。」と提案してください。この時、ユーザーから計画の修正を求められた場合は計画を修正して、再提案をしてください。

## アプリ概要

**FrontierAtlas (cross-platform)**は、学校施設における屋内マップの機能を持つアプリケーションです。現在はandroidを中心として開発していますが、今後webやiosに展開していく可能性があります。

### 主な機能

- 屋内マップの基盤表示：データに基づいて施設や廊下、部屋などの形を描画
- ラベル表示：各部屋におけるアイコンや部屋名の文字表示
- 階層変更：１階から５階までのフロア表示切り替え
- 検索：部屋の検索などを行う
- フッター：home(マップ), tools, calendar, classroomのボタンあり
- toolsやcalendarに゙関しては変更不要
- classroom:classroom.google.comへと偏移

## 技術スタック概要

- **言語**: TypeScript
- **フレームワーク**: React Native Expo
- **ビルド**: EAS
- **android操作**: adb(cli)
- **マップ描画**: Maplibre ReactNative
- **マップデータ形式**: GeoJson(Indoor Mapping Data Formatによる)

## アプリコマンド操作

### アプリ起動
1. ```adb devices```で特定のAndroidスマホが接続されていることを確認（エミュレータを除く）
2. ```npx expo start -a```でアプリ起動

### パッケージエラーなどreactnative内の問題検出
```npx expo-doctor```を実行

### アプリケーションのビルド
- 開発用の場合： ```eas build -p android --profile development```
- 製品用の場合： ```eas build -p android --profile production```