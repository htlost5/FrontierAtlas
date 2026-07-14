---
agent: DEV
task_id: TASK-geojson-redesign
date: 2026-07-07
status: approved
category: shared
destination: shared/impl/specs/requirements/
tags: [DEV, geojson, redesign]
---

# REQ: GeoJSON配布・管理システム 要件定義書

## 1. 概要
FrontierAtlas の GeoJSON 地図データ配布・管理システムを再設計。
GitHub Pages → Cloudflare R2 + CDN / インメモリ Map → SQLite / 起動時同期 → プッシュ通知+バックグラウンド更新。

## 2. 機能要件

### FR-01: Cloudflare R2 配信基盤
- GeoJSON データを R2 バケットに格納し CDN 経由で配信
- 一括リプレース（段階的移行なし）
- 無料枠（10GB/月、1000万リクエスト）内

### FR-02: SQLite クライアントストレージ
- expo-sqlite データベースに永続化
- MapId をキーに GeoJSON + メタデータ(sha256, size, version, source)を格納
- メモリ使用量がデータ数に比例しない

### FR-03: ハイブリッド更新戦略
- 起動時: SQLiteキャッシュ即表示（初回はアセットバンドルからリストア）
- プッシュ通知トリガーでバックグラウンド差分更新
- 全GeoJSONデータをアセットバンドルに内蔵（完全オフライン可）

### FR-04: プッシュ通知トリガー
- Cloudflare Worker でデータ更新検知→Expo Pushで通知
- サイレント通知（ユーザ非表示）
- 24時間フォールバック定期チェック

### FR-05: 部分成功 (Partial Success)
- ファイル単位で独立実行。1ファイル失敗が他に影響しない
- 失敗ファイルは次回再試行対象として記録

### FR-06: トランザクション的整合性
- SQLiteトランザクションで tmp→verify→commit
- 起動時に中途半端なデータをクリーンアップ

### FR-07: 3層フォールバック
- 優先度1: SQLite remoteキャッシュ → 2: SQLite assetキャッシュ → 3: アセットバンドル

## 3. 非機能要件
- 初回起動時キャッシュ構築: 2秒以内
- CDNレイテンシ(P95): 500ms以内
- メモリ使用量: 50MB以内
- 全インフラ無料枠内

## 4. 制約
- Expo SDK (React Native)
- expo-sqlite, expo-file-system, expo-notifications
- Cloudflare R2 + Workers（無料枠）
- 一括リプレース移行
