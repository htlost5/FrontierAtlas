---
agent: ORC
task_id: TASK-docs-001
date: 2026-07-14
status: draft
category: shared
destination: docs/shared/context/
related:
  - "[project-index.md](./project-index.md)"
tags:
  - ORC
  - context
  - project-meta
---

# frontieratlas — Project Meta

## 基本情報

| 項目 | 値 |
|---|---|
| プロジェクト名 | Frontier Atlas |
| リポジトリ | frontieratlas |
| 種別 | モノレポ |
| 主要言語 | TypeScript |

## サブプロジェクト

### mobile/ — モバイルアプリ

- **フレームワーク**: Expo SDK 52 + React Native
- **マップ**: @maplibre/maplibre-react-native
- **状態管理**: React Context, Jotai
- **ビルド**: EAS Build
- **CI/CD**: GitHub Actions
- **パッケージマネージャ**: npm

### tools/ — ユーティリティ

- `map-assets/`: マップアセット変換ツール（Python/Node.js）
- `scripts/`: GeoJSON アセット生成、データロードスクリプト
- `worker-push/`: Cloudflare Workers プッシュ通知

## 外部サービス

| サービス | 用途 |
|---|---|
| Cloudflare R2 | マップデータ配信 |
| Cloudflare Workers | プッシュ通知 |
| geolonia/mapray | グリフサーバ |

## 運用ルール

- エージェント運用ルールは `mobile/AGENTS.md` および `mobile/.github/instructions/` を参照
- 実装ログ・設計ドキュメントは `mobile/docs/` 配下で管理
