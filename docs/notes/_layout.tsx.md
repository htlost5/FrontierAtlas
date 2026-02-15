---
id: dbhmb2irb4ap0gbdpe7ykox
title: TSX
desc: ''
updated: 1770806923229
created: 1770806751524
---

## Map表示ロジック再構築に関して

### 基本構成

- コンテキストでマップに関連する設定の共有
- MapRoot内に、Slot を作成することで全タブにマップ表示
- 表示させたいhomeタブの時のみ表示するようなロジック

### 手順

- 現在実装されている仕組みの理解
- メインコンポーネントである、MapScreen.tsx / MapRoot.tsx の再構築