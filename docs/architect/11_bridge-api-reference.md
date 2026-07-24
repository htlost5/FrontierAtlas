# 11. Bridge API リファレンス

## 1. 本書について

本ドキュメントは React Native ↔ Kotlin Position Engine 間の Bridge API の完全な仕様を定義する。
API は命令（Command）とイベント（Event）の2系統に大別される。

---

## 2. Position Engine API（命令系）

React Native → Kotlin 方向の命令。すべて非同期。

### 2.1 initialize(config: EngineConfig): Promise\<void\>

Position Engine を初期化する。Map Assets の読み込みと各サブモジュールの生成を行う。

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `config.buildingId` | String | ✅ | 対象建物ID |
| `config.assetsPath` | String | ✅ | Map Assets の展開先パス |
| `config.mode` | "positioning" \| "collection" | ✅ | 動作モード |

**エラー**: Map Assets 読込失敗時は Fatal Event を発火し、Engine は未初期化状態のまま。

### 2.2 start(): Promise\<void\>

測位または収集を開始する。センサー取得を開始し、イベント通知を有効化する。

**前提条件**: `initialize()` が完了していること。

### 2.3 pause(): Promise\<void\>

一時停止。センサー取得を停止するが内部状態は保持する。

**用途**: アプリのバックグラウンド遷移時、MapLibre 一時障害時。

### 2.4 resume(): Promise\<void\>

一時停止からの再開。センサー取得を再開し、イベント通知を再有効化する。

**前提条件**: `pause()` 状態であること。

### 2.5 stop(): Promise\<void\>

完全停止。全リソースを解放する。再開には `initialize()` からのやり直しが必要。

**用途**: MapLibre 致命的障害時、アプリ終了時。

### 2.6 loadAssets(assetsPath: String): Promise\<void\>

Map Assets の更新を反映する。実行中でも呼び出し可能。

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `assetsPath` | String | ✅ | 新しい Map Assets の展開先パス |

---

## 3. Collection API（収集モード専用・命令系）

収集モード（`mode: "collection"`）でのみ有効な API。

### 3.1 startCollection(config: CollectionConfig, startPosition: GraphPosition): Promise\<void\>

収集セッションを開始する。

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `config.buildingId` | String | ✅ | 対象建物ID |
| `config.floorId` | String | ✅ | 対象フロアID |
| `config.deviceInfo` | DeviceInfo | ✅ | 収集端末情報 |
| `startPosition` | GraphPosition | ✅ | 収集開始位置（ユーザ指定のGround Truth） |

### 3.2 pauseCollection(): Promise\<void\>

収集を一時中断する。

### 3.3 resumeCollection(): Promise\<void\>

中断した収集を再開する。

### 3.4 stopCollection(endPosition: GraphPosition): Promise\<void\>

収集セッションを終了する。

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `endPosition` | GraphPosition | ✅ | 収集終了位置 |

### 3.5 correctPosition(newPosition: GraphPosition): Promise\<void\>

ドリフト検知時の補正操作。ユーザが正しい現在位置を再指定する。

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `newPosition` | GraphPosition | ✅ | 補正後の正しい位置 |

---

## 4. Asset Service API（命令系）

Map Assets のダウンロード・更新管理。

### 4.1 checkForUpdates(): Promise\<Manifest\>

最新の Map Assets マニフェストを取得する。

### 4.2 downloadAssets(manifest: Manifest): Promise\<String\>

Map Assets ZIP をダウンロードし、展開先パスを返す。

### 4.3 verifyAssets(assetsPath: String): Promise\<Boolean\>

ダウンロードした Map Assets の整合性を SHA-256 で検証する。

---

## 5. Permission Service API（命令系）

権限管理。

### 5.1 checkPermissions(): Promise\<PermissionStatus\>

必要な全権限（位置情報・Wi-Fi・ストレージ）の状態を確認する。

### 5.2 requestPermissions(): Promise\<PermissionStatus\>

不足している権限をOSの権限ダイアログ経由で要求する。

---

## 6. イベント一覧（通知系）

Kotlin → React Native 方向の通知。`06f_event-engine.md` §5 で定義されたイベントの完全一覧。

| イベント | 分類 | Payload | トリガー |
|---------|------|---------|---------|
| **PositionChanged** | Position | `{ Position, Heading, Floor, Confidence }` | 一定距離以上の移動 |
| **HeadingChanged** | Position | `{ Heading, Confidence }` | 一定角度以上の変化 |
| **FloorChanged** | Position | `{ Floor, Confidence }` | 階変更（即通知） |
| **ConfidenceChanged** | Position | `{ Confidence }` | `level` が HIGH↔MEDIUM↔LOW 間で遷移 |
| **EngineStatusChanged** | System | `{ Status }` | Running / Paused / Stopped 遷移 |
| **ErrorOccurred** | Error | `{ Code, Message, Recoverable }` | 各種エラー検知時 |

---

## 7. Error コード一覧

| Code | 分類 | Message 例 | Recoverable |
|------|------|-----------|-------------|
| `SENSOR_PERMISSION_DENIED` | Error | "位置情報・Wi-Fi権限がありません" | false |
| `WIFI_DISABLED` | Warning | "Wi-Fiが無効です。PDRのみで測位を継続します" | true |
| `ASSETS_LOAD_FAILED` | Fatal | "Map Assetsの読み込みに失敗しました" | false |
| `FINGERPRINT_DB_LOAD_FAILED` | Fatal | "Fingerprint DBが破損しています" | false |
| `MAPLIBRE_RENDER_FAILED` | Fatal | "地図の描画に失敗しました" | true |
| `DRIFT_DETECTED` | Warning | "位置精度が低下しています。補正を推奨します" | true |
| `SESSION_SAVE_FAILED` | Error | "収集データの保存に失敗しました" | false |

---

## 8. 関連ドキュメント

- `06_position-engine.md` — Position Engine 全体設計とライフサイクル
- `06f_event-engine.md` — Event Engine 詳細（イベント発火条件・抑制制御）
- `07_react-native-layer.md` — React Native 層と Position Engine の関係
- `08_event-communication.md` — システム全体の通信設計
- `09a_collection-engine.md` — 収集モードの詳細 API
