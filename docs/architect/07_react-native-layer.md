# 07. React Native アプリケーション層

## 1. React Native 層の責務

React Native は測位アルゴリズムを持たず、Kotlin Position Engine が通知する情報を基に画面を構築する。

| 担当 | 非担当 |
|-----|-------|
| UI, MapLibre 表示, 画面遷移, 状態管理 | センサー取得, Wi-Fi, 地磁気 |
| アニメーション, ユーザー入力 | PDR, Fingerprint |
| Position Engine 制御 | Map Matching, 測位計算 |
| Map Assets ダウンロード, キャッシュ管理 | |

## 2. レイヤ構成

```text
UI Screen → ViewModel → State Store → Application Service → Native Bridge → Android Position Engine
```

| レイヤ | 責務 |
|-------|------|
| **Presentation Layer** | 画面のみ構築（Home/Maps/Search/Settings Screen）。ロジックを持たない |
| **Application Layer** | 画面共通ロジック（Building 切替・Floor 切替・Route 開始・Assets 更新・Download 管理）。UI から直接 Native Module を呼ばない |
| **State Layer** | 状態管理（UI と分離）。Current Position / Floor / Heading / Route / Building / Download Status / UI State を保持。MapLibre は Store を監視するのみ |
| **Service Layer** | ビジネスロジック実行 |
| **Native Bridge Layer** | React Native 専用 API（PositionService / AssetService / PermissionService）。Native Module を直接利用しない |
| **MapLibre Layer** | 描画専用（後述） |

## 3. MapLibre の責務

MapLibre は**描画専用レイヤ**。

| 担当 | 非担当 |
|-----|-------|
| 地図描画, GeoJSON 表示, Symbol/Line/Polygon 表示 | データ取得, 状態管理, 測位計算 |
| Camera 操作, FillLayer/LineLayer/SymbolLayer, Annotation | 座標計算, 補正 |

## 4. Position Engine との関係

```text
initialize() → start() → Event受信 → UI更新
```

React Native は Bridge API のみを利用し、Position Engine の内部構造を認識しない。位置情報を提供するサービスとして利用する。

## 5. イベントフロー・データフロー

### 5.1 イベントフロー（測位→UI）

```text
Position Engine → Bridge → Store → core/coordinate/(座標変換) → MapLibre → 画面更新
```

イベントは Store で一元管理する。Position Engine から受信した位置はローカル座標のため、MapLibre に渡す前に `core/coordinate/CoordinateTransformEngine` で GPS 座標に変換する。

### 5.2 データフロー（Map Assets→描画）

```text
Map Assets（GPS座標版 GeoJSON） → Asset Service → Store → MapLibre
```

Map 描画データは Position Engine を経由しない。MapLibre は GPS 座標（WGS84）の GeoJSON を直接読み込む。ローカル座標版データは Position Engine のみが利用する。

## 6. 設計上の要点

### Camera 制御

React Native 側で管理（Follow Mode / Free Mode / Rotate / Zoom Animation）。Position Engine は Camera を認識しない。

### Route 表示

Navigation Graph から生成された経路を表示する。経路計算は `core/navigation/RouteCalculationEngine` が担当し、Node/Edge ID の順序リストを出力する。表示時は UI 側が ID を基に Map Assets（GPS 座標版 GeoJSON）から座標を引き当て、MapLibre で LineString として描画する。

> **注**: `RouteCalculationEngine` は座標を保持せずグラフトポロジーのみを扱う。座標の引き当てと描画は UI 層の責務。詳細は `07a_mobile-source-structure.md` §4.5.2 参照。

### UI 更新

Marker / Heading / Route / Floor / Camera を、Store 変更時のみ差分更新。Map 全体の再描画は行わない。

### パフォーマンス設計

- 差分更新（Marker のみ更新、Layer 再生成を避ける）
- Camera 更新抑制
- Map 全体再描画の禁止

## 7. MapLibre 障害時の縮退動作

MapLibre が描画不能となった場合（地図タイル読込不可・WebGL コンテキスト喪失・GeoJSON パースエラー等）、React Native は以下の手順で縮退する：

```text
MapLibre 障害検知
  ↓
Position Engine へ stop() を発行（測位停止・センサー解除・バッテリー消費抑制）
  ↓
Store に MapError 状態を設定
  ↓
エラー画面を表示（「地図を読み込めません」＋再試行ボタン）
  ↓
ユーザが再試行 / 自動リトライ（指数バックオフ）
  ↓
MapLibre 再初期化 → Engine re-initialize() → start()
```

| 障害レベル | エンジン操作 | UI 表示 |
|-----------|------------|---------|
| **致命的**（WebGL 喪失・タイルサーバ到達不可） | `stop()`（全リソース解放） | エラー画面＋再試行ボタン |
| **一時的**（タイル読込タイムアウト） | `pause()`（内部状態保持） | オーバーレイ警告＋自動リトライ |

> **原則**: 地図が表示できない状態で測位を継続してはならない。ユーザに位置情報を地図上で示せないため無意味であり、バッテリーを浪費するのみである。
