# 06a. Sensor Layer（センサー取得層）

## 1. 本節の目的

Sensor Layer は Android Position Engine の最下層に位置し、Android OS が提供する各種センサーやシステムサービスから情報を取得し、上位レイヤへ提供する責務を持つ。**「取得」と「正規化」のみ**を担当し、位置推定や歩行判定などのアルゴリズムは実行しない。

## 2. 設計方針

- センサー取得と位置推定を完全に分離する
- Android 固有 API をこのレイヤ内へ閉じ込める
- 上位レイヤへ統一されたデータモデルを提供する
- センサー取得失敗時も他のセンサーへ影響を与えない
- 必要最小限のセンサーのみを有効化し、消費電力を抑える

## 3. レイヤ構造

```text
Position Layer
        ▲
        │
Sensor Provider
        ▲
        │
Sensor Layer
        ▲
        │
Android Framework
```

Sensor Layer は Android Framework のみを利用し、Position Layer は Sensor Layer の公開インターフェースのみを利用する。

## 4. 取得対象

| 種類 | 利用目的 |
|------|---------|
| 加速度 | 歩行検出・PDR |
| ジャイロ | 端末姿勢・Heading 補正 |
| 地磁気 | 方位・Fingerprint |
| 回転ベクトル | 安定した姿勢推定 |
| 気圧（対応端末） | 階推定補助 |
| Wi-Fi スキャン | Wi-Fi Fingerprint |
| システム時刻 | 時系列同期 |

GPS は屋内測位には利用せず、Position Engine の必須入力とはしない。

## 5. モジュール構成

```text
Sensor Layer
├── SensorController        ← 全体管理（初期化・登録・解除・状態管理）
├── MotionSensorProvider    ← 加速度・ジャイロ・回転ベクトル取得
├── OrientationProvider     ← 姿勢情報
├── MagneticProvider        ← 地磁気ベクトル取得
├── PressureProvider        ← 気圧取得・正規化
├── WifiScanner             ← BSSID・RSSI・周波数・チャンネル取得
├── SensorScheduler         ← 取得周期管理
└── SensorCache             ← 最新センサー値保持
```

### 5.1 SensorController

Sensor Layer 全体を管理。初期化・センサー登録・センサー解除・状態管理・ライフサイクル制御を担当。他モジュールは直接 Android の SensorManager を操作しない。

### 5.2 MotionSensorProvider

加速度・ジャイロ・回転ベクトルを取得。タイムスタンプ付与・生データ生成を担当。歩数判定は行わない。

### 5.3 MagneticProvider

地磁気センサーから地磁気ベクトルを取得し生データを提供。Fingerprint 照合は Position Layer が担当する。

### 5.4 PressureProvider

気圧を取得し正規化。階判定は Position Layer が担当する。

### 5.5 WifiScanner

BSSID・RSSI・周波数・チャンネル・セキュリティ種別（取得可能な範囲）を取得。Wi-Fi Fingerprint 照合は行わない。

### 5.6 SensorScheduler

用途に応じた取得周期を管理する：

| センサー | 推奨周期 |
|---------|---------|
| 加速度 | 高頻度 |
| ジャイロ | 高頻度 |
| 回転ベクトル | 高頻度 |
| 地磁気 | 中頻度 |
| 気圧 | 低頻度 |
| Wi-Fi | 数秒間隔 |

### 5.7 SensorCache

最新のセンサー値を保持。Position Layer は SensorCache から値を取得し、Android API を直接利用しない。

## 6. データモデル

全センサーを共通形式 `SensorSample { timestamp, sensorType, values, accuracy }` へ変換する。Position Layer はセンサー種類を意識せず処理できる。

## 7. ライフサイクル

```text
Initialize → Register Sensors → Running ⇄ Pause/Resume → Stop
```

| 状態 | 動作 |
|-----|------|
| Initialize | SensorManager 取得・WifiManager 取得・Provider 生成 |
| Running | Listener 登録・Scheduler 開始 |
| Pause | Listener 解除・Wi-Fi 停止（内部状態は保持） |
| Resume | Listener 再登録 |
| Stop | 全リソース解放 |

## 8. スレッド設計

Sensor Layer は UI スレッドで処理しない。推奨構成：

```text
UI Thread → Bridge → Position Thread → Sensor Thread → Android Sensor API
```

Sensor Thread は Kotlin Coroutine または HandlerThread 上で動作。React Native の描画処理とは完全に分離する。

## 9. バッテリー最適化

- 使用しないセンサーは登録しない
- Wi-Fi は必要時のみスキャンする
- アプリがバックグラウンドになった場合は取得頻度を下げる（または停止）
- Position Engine 停止時はすべて解除する

## 10. エラー処理（局所化）

| 状況 | 対応 |
|------|------|
| 地磁気センサー不在 | 地磁気 Provider のみ停止、他センサーは継続 |
| Wi-Fi 取得不可 | Wi-Fi Engine を停止、PDR のみ継続 |
| 気圧センサー非搭載 | 階推定補助を無効化 |
| センサー権限エラー | Position Controller へ通知、React Native にイベント送信 |

## 11. 他レイヤとの関係

- **Position Layer**: SensorSample / WifiScanResult / MagneticSample などの共通データを提供。Position Layer は Sensor Layer の内部実装を知らない。
- **React Native**: Sensor Layer は React Native を一切認識しない。必ず `Position Engine → Bridge → React Native` の経路を通る。
