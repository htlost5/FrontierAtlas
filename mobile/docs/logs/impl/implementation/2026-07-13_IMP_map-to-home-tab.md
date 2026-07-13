---
agent: IMP
task_id: TASK-map-to-home-tab
date: 2026-07-13
status: approved
category: log
destination: logs/impl/implementation/
tags:
  - IMP
  - refactoring
  - map
  - tab-layout
---

# Implementation Log: マップ画面を全タブ背景から home タブ独立コンテンツに移動

## 変更概要

`MapRoot` が全タブの背景として常駐していた構成を、home タブだけの独立コンテンツに変更した。

## 変更ファイル

### 1. `app/(tabs)/_layout.tsx`

- `SearchProvider` の import を削除
- `MapRoot` の import を削除
- `SearchProvider` ラッパーを削除
- `MapRoot` ラッパーを削除
- 構成を `View` → `Slot` + `ScreenFC` のみのシンプルな形に変更
- コメントを新しい構成に合わせて更新

### 2. `app/(tabs)/home/index.tsx`

- `SearchProvider` を import 追加
- `MapRoot` を import 追加
- `MapControlsFC` を `SearchProvider` → `MapRoot` でラップ
- コメントを新しい構成に合わせて更新

## 検証結果

- 両ファイルとも TypeScript エラーなし
- 既存のインポートパスは変更なし
- 他のファイルには影響なし

## 決定事項

- `SearchProvider` と `MapRoot` のライフサイクルが home タブに限定されるため、他のタブではマップ関連のコンテキストが不要になった
- タブ切り替え時のメモリ使用量削減が期待できる
