# 03. システム全体アーキテクチャ

## 1. アーキテクチャの全体像

システム全体は以下の6層で構成される。各レイヤは直下のレイヤのみを利用し、下位レイヤの実装詳細を意識しない。

```text
┌──────────────────────────────────────────────┐
│               React Native UI                │
│ 画面・状態管理・MapLibre操作・ユーザー操作     │
└──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│             Application Layer                │
│ MapAssetManager・Navigation・State           │
└──────────────────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
┌───────────────────┐   ┌────────────────────┐
│   MapLibre Layer   │   │ Kotlin Bridge Layer│
└───────────────────┘   └────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────┐
│          Android Position Engine             │
└──────────────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────┐
│                   Sensor                     │
└──────────────────────────────────────────────┘
```

## 2. コンポーネント責務

| コンポーネント | 責務（担当） | 責務外（非担当） |
|--------------|------------|---------------|
| **React Native** | UI, MapLibre 操作, ナビゲーション表示, ピン表示, 状態管理 | センサー取得, PDR, Wi-Fi 推定 |
| **Kotlin Position Engine** | センサー取得, PDR, 地磁気, Wi-Fi, 推定位置生成, フィルタリング | 地図描画, UI, ボタン操作 |
| **MapLibre** | GeoJSON 描画, ピン/アイコン/ライン表示, レイヤ管理 | 位置推定, ナビゲーション計算, センサー取得 |
| **Map Assets Pipeline** | QGIS データのエクスポート・座標変換（GPS / ローカル両系）・GeoJSON 生成・Validation・Release 生成。Node/Edge データの生成も担当 | アプリ動作 |

## 3. レイヤ構造

| レイヤ | 構成 | 責務 |
|-------|------|------|
| **Presentation Layer** | React Native, Screen, Components | 画面表示のみ |
| **Application Layer** | State, Navigation, MapAssetManager | アプリ全体の制御 |
| **Bridge Layer** | React Native ↔ Kotlin 接続 | API 呼び出し, Event 受信（計算は行わない） |
| **Domain Layer** | Kotlin 測位エンジン | 位置推定のみ |
| **Infrastructure Layer** | Sensors | データ取得 |

## 4. データフロー

### 4.1 起動時（assetの更新とengineの起動）

```text
App Start → MapAssetManager → Manifest取得 → 更新判定
→ 必要ならDownload → 展開 → MapLibre読込 → Position Engine初期化
```

### 4.2 測位開始時

```text
Start Positioning → Bridge → Position Engine → Sensor開始 → 位置推定
```

### 4.3 位置更新時

```text
Sensor → PDR → Wi-Fi → Geomagnetic → Fusion → Map Matching
→ 座標更新 → Event → React Native → MapLibre更新
```

## 5. イベント駆動の基本方針

Position Engine は React Native からポーリングされるのではなく、**意味のある変化が発生した時だけイベントを通知する**。微小な変化は Engine 内部で吸収し、Bridge 通信量・UI 更新回数・バッテリー消費を削減する。詳細は `08_event-communication.md` 参照。

## 6. 座標管理

システムは **GPS 座標（WGS84）とローカル座標系の2種類を併用**する。Map Assets Pipeline が両方を生成し同一リリースに同梱する。

### 6.1 座標系の定義

| 座標系 | 利用コンポーネント | 用途 |
|-------|-----------------|------|
| **GPS 座標（WGS84）** | MapLibre（地図描画） | GeoJSON の地物座標、地図タイル表示 |
| **ローカル座標系** | Position Engine（測位）, Navigation（経路計算） | 位置推定・マップマッチング・経路探索 |

### 6.2 コンポーネント別の使用座標

| コンポーネント | 使用座標系 | データソース |
|--------------|----------|------------|
| Position Engine（Map Matching 含む） | ローカル座標系 | Map Assets（ローカル座標版） |
| Navigation（経路計算） | ローカル座標系 | Map Assets（ローカル座標版 Navigation Graph） |
| MapLibre（地図描画） | GPS 座標（WGS84） | Map Assets（GPS 座標版 GeoJSON） |

### 6.3 座標変換ルール

- **静的データ（GeoJSON・Fingerprint DB 等）の実行時座標変換は行わない**。各コンポーネントは自身が必要とする座標系のデータを直接読み込む。
- **ライブ位置（Position Engine 出力）はローカル座標のみ**のため、MapLibre 表示時に `core/coordinate/CoordinateTransformEngine` による GPS 座標への実行時変換を行う。詳細は `07a_mobile-source-structure.md` §5.2 参照。
- Map Assets Pipeline が GPS 座標版（MapLibre 用 GeoJSON）とローカル座標版（Position Engine 用）の両方を生成し、同一リリースに同梱する。
- ローカル座標は、指定した原点から東西南北にメートル系の直交座標で変換する

## 7. エラー分離

各層でエラーを閉じ込める。エラー種別に応じて縮退レベルを変える：

| エラー種別 | 対応 | 理由 |
|-----------|------|------|
| **MapLibre 描画失敗**（地図タイル読込不可・WebGL コンテキスト喪失等） | React Native が即座に Position Engine を `stop()` し、ユーザにエラー画面を表示 | 地図が利用できない状態での測位継続は無意味。バッテリー消費を防ぐ |
| **Wi-Fi 取得失敗** | PDR のみ継続し、React Native へ警告通知（測位は継続） | 縮退運転で測位精度は落ちるが継続可能 |
| **地磁気センサー不在** | 地磁気 Fingerprint を無効化し、Wi-Fi+PDR で継続 | 部分縮退で対応可能 |
| **Fingerprint DB 読込失敗** | Position Engine を `pause()`（内部状態保持）。React Native へ Fatal 通知 | 絶対位置補正なしではドリフトが蓄積し危険 |

MapLibre 障害からの復旧フロー：
```text
MapLibre 障害検知 → Engine stop() → エラー画面表示 → ユーザ操作 or 自動リトライ
→ MapLibre 再初期化 → 成功 → Engine re-initialize() → start() → 通常動作
```

## 8. アーキテクチャの責務一覧

| コンポーネント | 主な責務 | 他コンポーネントとの関係 |
|--------------|---------|---------------------|
| React Native UI | 画面表示・ユーザー操作 | Application Layer を利用 |
| Application Layer | アプリ全体制御・MapAssetManager・状態管理 | UI と Bridge を仲介 |
| MapLibre | 地図・レイヤ・ピン・ライン描画 | Application Layer から GeoJSON や表示命令を受ける |
| Kotlin Bridge | React Native と Kotlin 間の API・イベント仲介 | データ変換のみ（測位計算は行わない） |
| Android Position Engine | センサー取得・PDR・Wi-Fi・地磁気・位置推定 | Bridge へイベント通知 |
| Map Assets Pipeline | QGIS データ変換・座標変換（GPS/ローカル両系）・Validation・Release 生成 | GitHub Release へ配布物を生成 |
