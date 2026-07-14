# Frontier Atlas 🗺️

屋内マップアプリケーション「Frontier Atlas」のモノレポ。

## 構成

| パス | 説明 |
|---|---|
| [`mobile/`](./mobile/) | iOS/Android モバイルアプリ（Expo + React Native + MapLibre） |
| [`tools/map-assets/`](./tools/map-assets/) | マップアセット変換・生成ツール |
| [`tools/scripts/`](./tools/scripts/) | データ生成・ビルドスクリプト |
| [`tools/worker-push/`](./tools/worker-push/) | プッシュ通知 Cloudflare Worker |

## ドキュメント

- [Project Index](./docs/shared/context/project-index.md)
- [Project Meta](./docs/shared/context/project-meta.md)
- [Mobile App README](./mobile/README.md)
- [Mobile CHANGELOG](./mobile/CHANGELOG.md)

## 開発

```bash
# モバイルアプリ
cd mobile
npm install
npx expo start

# マップアセットツール
cd tools/map-assets
# README 参照
```
