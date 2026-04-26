---
applyTo: "app/**,src/features/home/**,src/shared/components/**"
---

# UI / Map 実装ルール

## UI層の責務

- UI層で直接 FS/network を呼ばない。必要なデータ取得は hook/service 経由にする。
- `MapContainer` は MapView ラッパ責務に限定し、業務ロジックを入れない。

## 状態管理

- 共有状態は既存 Context（Network/Map/Search）を優先利用する。
- ローカルで完結する状態のみ `useState` を使う。

## 表示/体験

- 不要な再レンダリングを増やす新規オブジェクト生成を避ける。
- アクセシビリティ属性（`accessibilityLabel`）を主要操作で検討する。

## クロスプラットフォーム実装方針

- コンポーネント・ロジックは可能な限り共通化し、プラットフォーム分岐は最小限にとどめる。
- 共通化が不可能な場合のみ `react-native` の `Platform` モジュールを使用して分岐する。
- 地図（Map）機能の実装エンジンは次に固定する。
  - Android: `maplibre-react-native`
  - Web: `maplibre-gl`（TypeScript）
