---
agent: ORC
task_id: TASK-docs-001
date: 2026-07-14
status: draft
category: shared
destination: docs/shared/context/
related: []
tags:
  - ORC
  - context
  - project-index
---

# frontieratlas — Project Index

フロンティアアトラスプロジェクト全体の構成インデックス。

---

## プロジェクト概要

屋内マップアプリケーション「Frontier Atlas」のモノレポ。

---

## サブプロジェクト構成

| パス | 種別 | 概要 |
|---|---|---|
| `mobile/` | Expo React Native アプリ | iOS/Android 向け屋内マップアプリ |
| `tools/map-assets/` | マップアセット生成 | マップ表示用アセットの変換・生成ツール |
| `tools/scripts/` | ユーティリティスクリプト | GeoJSON アセットマップ生成、データロードビルド |
| `tools/worker-push/` | Cloudflare Worker | プッシュ通知配信 Worker |
| `docs/` | プロジェクト全体ドキュメント | プロジェクトメタ情報・インデックス（本ファイル） |
| `mobile/docs/` | モバイル開発ドキュメント | エージェント実装ログ・設計決定・仕様書 |

---

## ドキュメント構造

```
frontieratlas/
├── README.md                        ← プロジェクト全体概要
├── docs/shared/context/
│   ├── project-index.md             ← 本ファイル
│   └── project-meta.md              ← プロジェクトメタ情報
├── mobile/
│   ├── README.md                    ← モバイルアプリ概要
│   ├── CHANGELOG.md                 ← 変更履歴
│   ├── AGENTS.md                    ← エージェント定義
│   └── docs/
│       ├── logs/impl/               ← 実装ログ
│       │   ├── architecture/        ←   アーキテクチャ設計ログ
│       │   ├── implementation/      ←   実装ログ
│       │   ├── planning/            ←   計画ログ
│       │   ├── releases/            ←   リリースログ
│       │   ├── review/              ←   レビューログ
│       │   └── testing/             ←   テストログ
│       └── shared/                  ← 共有設計ドキュメント
│           ├── impl/
│           │   ├── decisions/architecture/
│           │   └── specs/requirements/
│           ├── search/specs/
│           └── tasks/active/
├── tools/
│   ├── map-assets/
│   │   └── docs/cordinate.md
│   ├── scripts/
│   └── worker-push/
└── .github/workflows/
```

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| モバイルアプリ | Expo SDK 52, React Native, TypeScript |
| マップ | MapLibre GL Native |
| バックエンド | Cloudflare Workers, R2 |
| CI/CD | GitHub Actions, EAS Build |
