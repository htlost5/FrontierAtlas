# 09a. Collection Engine（収集エンジン ― Android Native）

## 1. 本節の目的

Collection Engine は、Android Position Engine の収集モードにおける中核コンポーネントである。ユーザが指定した Ground Truth 位置にセンサー特徴量を紐付け、Fingerprint DB 構築のための Raw Sample を生成・保存する。

## 2. 責務

| 担当 | 非担当 |
|-----|-------|
| 収集セッションのライフサイクル管理 | 地図描画・Graph 表示 |
| PDR による歩行トラッキング（収集モード用） | Node/Edge 選択 UI |
| 自動チェックポイント生成 | Fingerprint DB への変換（09c 担当） |
| ドリフト検知・補正通知 | React Native への UI 更新指示 |
| 経路遡及補正（比例配分／破棄判定） | Map Assets 管理 |
| センサー特徴量の収集・Sample 生成 | 測位（Positioning Mode） |
| SQLite への Raw Sample 保存 | |
| セッション中断・再開 | |

## 3. モジュール構成

```text
Collection Engine（Android Native / Kotlin）
│
├── CollectionSessionManager       ← セッションライフサイクル管理
│   ├── SessionStateMachine         ← 状態遷移制御
│   └── SessionRepository           ← SQLite セッション CRUD
│
├── CollectionPdrTracker            ← 収集モード用 PDR トラッキング
│   ├── PdrEngine（既存再利用）      ← 歩行検出・歩幅・Heading
│   ├── GraphPositionTracker        ← グラフ位置追跡（Edge パラメータ管理）
│   └── PositionProjector           ← 相対移動量 → Graph 上位置投影
│
├── CheckpointManager               ← 自動チェックポイント管理
│   ├── AutoCheckpointGenerator     ← 一定距離/時間/Node到達での自動生成
│   └── CheckpointRepository        ← SQLite チェックポイント CRUD
│
├── DriftDetector                   ← PDR ドリフト検知
│   ├── HeadingDriftAnalyzer        ← Heading 変動パターン分析
│   ├── DistanceDriftAnalyzer       ← 歩幅累積誤差分析
│   └── DriftThresholdEvaluator     ← 閾値判定・通知レベル決定
│
├── PathCorrector                   ← 経路補正エンジン
│   ├── SegmentReliabilityEvaluator ← 区間信頼性評価（距離・時間・Heading安定性）
│   ├── RubberBandCorrector         ← 比例配分遡及補正
│   └── SegmentDiscarder            ← 信頼不能区間の破棄マーク処理
│
├── CollectionRecorder              ← Sample 記録エンジン
│   ├── FeatureExtractor            ← センサー生データ → 特徴量変換
│   │   ├── WifiFeatureExtractor
│   │   ├── MagneticFeatureExtractor
│   │   └── PressureFeatureExtractor
│   ├── SampleBuilder               ← Feature + Position → Sample 構築
│   └── SampleRepository            ← SQLite Sample CRUD
│
├── DeviceCalibrator                ← 端末較正
│   ├── WifiCalibrationProfile      ← RSSI オフセットプロファイル
│   └── CalibrationRepository       ← SQLite 較正データ CRUD
│
└── CollectionEventEngine           ← 収集モードイベント発火
    ├── DriftWarningEvent           ← ドリフト検知通知
    ├── CheckpointEvent             ← チェックポイント生成通知
    ├── CorrectionCompletedEvent    ← 補正完了通知
    ├── SessionStateEvent           ← セッション状態変化通知
    └── CollectionErrorEvent        ← エラー通知
```

## 4. データモデル

### 4.1 CollectionSession

```kotlin
data class CollectionSession(
    val sessionId: String,          // UUID
    val buildingId: String,         // 対象建物ID
    val floorId: String,            // 対象フロアID（収集中の階切替なし）
    val deviceInfo: DeviceInfo,     // 端末情報
    val startTime: Long,            // セッション開始時刻（epoch ms）
    val endTime: Long?,             // セッション終了時刻
    val status: SessionStatus,      // ACTIVE / PAUSED / COMPLETED / DISCARDED
    val totalDistance: Float,       // 総歩行距離（m）
    val sampleCount: Int,           // 収集サンプル総数
    val checkpointCount: Int,       // チェックポイント数
    val correctionCount: Int,       // 補正操作回数
    val discardedSegmentCount: Int, // 破棄区間数
    val metadata: Map<String, String> // 拡張用
)

enum class SessionStatus { ACTIVE, PAUSED, COMPLETED, DISCARDED }

data class DeviceInfo(
    val model: String,              // 例: "Pixel 8"
    val manufacturer: String,       // 例: "Google"
    val androidVersion: String,     // 例: "14"
    val wifiChipset: String?,       // WiFi チップセット（取得可能な場合）
    val calibrationProfileId: String? // 較正プロファイルID
)
```

### 4.2 GraphPosition（グラフ上の位置表現）

```kotlin
sealed class GraphPosition {
    data class OnNode(
        val nodeId: String
    ) : GraphPosition()

    data class OnEdge(
        val edgeId: String,
        val t: Float,               // 0.0（始点Node）〜 1.0（終点Node）
        val fromNodeId: String,     // 始点Node ID
        val toNodeId: String        // 終点Node ID
    ) : GraphPosition()
}
```

### 4.3 CollectionSample（収集サンプル）

```kotlin
data class CollectionSample(
    val sampleId: String,           // UUID
    val sessionId: String,          // 所属セッション
    val sequenceNumber: Int,        // セッション内連番
    val timestamp: Long,            // サンプリング時刻（epoch ms）
    val graphPosition: GraphPosition, // グラフ上の位置
    val localPosition: LocalPosition, // ローカル座標（m）
    val wifiFeatures: WifiFeatures?,   // WiFi 特徴量
    val magneticFeatures: MagneticFeatures?, // 地磁気特徴量
    val pressureFeatures: PressureFeatures?, // 気圧特徴量
    val pdrState: PdrSnapshot?,      // 収集時点のPDR状態（デバッグ用）
    val status: SampleStatus        // VALID / DISCARDED / INTERPOLATED
)

enum class SampleStatus { VALID, DISCARDED, INTERPOLATED }

data class LocalPosition(
    val x: Float,                   // ローカル座標系 X（m）
    val y: Float,                   // ローカル座標系 Y（m）
    val floorId: String
)
```

### 4.4 WifiFeatures（WiFi 特徴量）

```kotlin
data class WifiFeatures(
    val scanResults: List<WifiApFeature>,
    val scanTimestamp: Long,        // スキャン時刻
    val scanDurationMs: Int         // スキャン所要時間
)

data class WifiApFeature(
    val bssid: String,              // BSSID（正規化形式: "xx:xx:xx:xx:xx:xx"）
    val ssid: String?,              // SSID（オプショナル、識別子としては不使用）
    val rssi: Int,                  // 生RSSI（dBm）
    val rssiNormalized: Float,      // 正規化RSSI（0.0〜1.0、デバイス較正適用済）
    val frequency: Int,             // 周波数（MHz）
    val isCalibrated: Boolean       // 較正済みか
)
```

### 4.5 MagneticFeatures（地磁気特徴量）

```kotlin
data class MagneticFeatures(
    val rawVector: Triple<Float, Float, Float>, // 生ベクトル (x, y, z) μT
    val normalizedVector: Triple<Float, Float, Float>, // 正規化ベクトル（大きさ1.0）
    val magnitude: Float,           // ベクトル大きさ（μT）
    val horizontalIntensity: Float, // 水平成分強度
    val verticalIntensity: Float,   // 鉛直成分強度
    val anomalyScore: Float,        // 周囲平均からの異常度（0.0〜1.0）
    val stability: Float,           // 直近Nサンプルの分散（小さいほど安定）
    val sampleWindowMs: Int         // 集約ウィンドウ幅
)
```

### 4.6 PressureFeatures（気圧特徴量）

```kotlin
data class PressureFeatures(
    val pressureHpa: Float,         // 気圧（hPa）
    val relativePressure: Float,    // セッション内相対気圧（セッション開始時からの差分）
    val pressureTrend: Float,       // 直近Nサンプルの傾き（hPa/min）
    val confidence: Float           // 気圧センサー精度（0.0〜1.0）
)
```

### 4.7 Checkpoint（チェックポイント）

```kotlin
data class Checkpoint(
    val checkpointId: String,       // UUID
    val sessionId: String,
    val sequenceNumber: Int,        // セッション内連番
    val timestamp: Long,
    val graphPosition: GraphPosition,
    val generationType: CheckpointType, // AUTO_NODE / AUTO_DISTANCE / AUTO_TIME / MANUAL
    val sampleCountSinceLast: Int,  // 前回チェックポイントからのサンプル数
    val distanceSinceLast: Float,   // 前回チェックポイントからの距離（m）
    val pdrConfidenceAtGeneration: Float // 生成時点のPDR信頼度
)

enum class CheckpointType { AUTO_NODE, AUTO_DISTANCE, AUTO_TIME, MANUAL }
```

### 4.8 PdrSnapshot（PDR 状態スナップショット）

```kotlin
data class PdrSnapshot(
    val stepCount: Int,
    val estimatedStride: Float,
    val heading: Float,             // 進行方向（度、0=北）
    val deltaX: Float,              // 前回からのX変位
    val deltaY: Float,              // 前回からのY変位
    val walkingState: WalkingState,
    val confidence: Float           // PDR 信頼度（0.0〜1.0）
)

enum class WalkingState { IDLE, WALKING, TEMPORARY_STOP, STOPPED }
```

## 5. PDR トラッキング（収集モード）

### 5.1 測位モードとの差異

収集モードの PDR トラッキングは測位モードと以下の点で異なる：

| 項目 | 測位モード | 収集モード |
|------|----------|-----------|
| 初期位置 | 最後の既知位置または未設定 | ユーザ指定の GraphPosition（Ground Truth） |
| 位置更新先 | Position Fusion へ提供 | GraphPositionTracker でグラフ上位置を更新 |
| ドリフト対応 | Fingerprint/Fusion で補正 | ユーザ手動補正 + チェックポイント |
| 出力 | RelativePosition | GraphPosition + PdrSnapshot |

### 5.2 GraphPositionTracker

PDR の相対移動量をグラフ上の位置に変換する。

```text
PDR RelativePosition（ΔX, ΔY, Heading）
        │
        ▼
PositionProjector: ローカル座標系の ΔX, ΔY をグラフ上の移動に変換
        │
        ├→ 現在位置が Edge 上: Edge の方向ベクトルに射影、t パラメータを更新
        │   t が 0.0 未満 → 前の Node に到達（逆向き）
        │   t が 1.0 超過 → 次の Node に到達
        │
        └→ 現在位置が Node 上: 接続 Edge のうち Heading に最も近い方向の Edge を選択
```

### 5.3 GraphPosition 更新アルゴリズム

```text
1. PDR から RelativePosition（deltaX, deltaY, heading）を受信
2. GraphPositionTracker が現在の GraphPosition を取得
3. OnEdge の場合:
   a. Edge の方向ベクトルを計算（fromNode → toNode）
   b. deltaX, deltaY を Edge 方向に射影 → edgeDelta
   c. edgeLength から t の変化量を計算: Δt = edgeDelta / edgeLength
   d. t = t + Δt（Heading が Edge 方向と逆向きなら Δt は負）
   e. t が [0.0, 1.0] 範囲外なら Node 到達として処理
4. OnNode の場合:
   a. 接続 Edge の方向ベクトルを列挙
   b. PDR Heading と各 Edge 方向の角度差を計算
   c. 最小角度差の Edge を選択（閾値 45°以内、全Edgeが閾値超過なら待機）
   d. 選択した Edge 上に移動（t を適切に設定）
5. 更新された GraphPosition を CollectionSessionManager に通知
```

## 6. 自動チェックポイント生成

### 6.1 生成条件（複合判定）

CheckpointManager は以下の条件で自動チェックポイントを生成する。**いずれか1つが成立した時点**で生成する。

| 条件 | 閾値（デフォルト） | 説明 |
|------|------------------|------|
| **Node 到達** | 即時 | ユーザがグラフ上の Node に到達した（PDR軌跡がNodeに交差） |
| **距離** | 15m ごと | 前回チェックポイントから一定距離歩行 |
| **時間** | 30秒 ごと | 前回チェックポイントから一定時間経過 |
| **Heading 変動** | 30°以上の累積変化 | 曲がり角通過の可能性 |
| **PDR Confidence 低下** | value < 0.5 | PDR 信頼度が MEDIUM 下限を下回った |

### 6.2 チェックポイントの役割

- 経路補正時の**区間区切り**（補正の影響範囲をチェックポイント間で閉じる）
- セッション再開時の**復帰点**
- 収集品質の**評価単位**（チェックポイント区間ごとの信頼度評価）

### 6.3 生成アルゴリズム

```text
1. 各 PDR 更新時に以下の評価を実行:
   a. GraphPosition が Node 上か（OnNode かつ前回と異なる Node）
   b. 前回チェックポイントからの累積距離 >= 15m
   c. 前回チェックポイントからの経過時間 >= 30s
   d. 前回チェックポイントからの Heading 累積変化 >= 30°
   e. 現在の PDR Confidence.value < 0.5（かつ前回CP生成時は >= 0.5）
2. いずれか成立 → 現在位置で Checkpoint 生成
3. SQLite に保存 + CollectionEventEngine 経由で React Native に通知
```

## 7. ドリフト検知と補正

### 7.1 DriftDetector ― 検知ロジック

```text
DriftDetector は以下の指標を複合評価し、ドリフト状態を判定する:

1. Heading 安定性スコア（0.0〜1.0）:
   - 直近 N サンプルの Heading 標準偏差
   - 標準偏差 < 5° → 1.0 / 5°〜15° → 0.7 / 15°〜30° → 0.4 / > 30° → 0.1

2. 歩幅一貫性スコア（0.0〜1.0）:
   - 直近 N 歩の歩幅変動係数（CV）
   - CV < 0.1 → 1.0 / 0.1〜0.2 → 0.7 / 0.2〜0.3 → 0.4 / > 0.3 → 0.1

3. 累積距離信頼度:
   - 最終チェックポイントからの累積距離が 30m を超えると線形に低下
   - 30m → 0.8 / 50m → 0.5 / 80m → 0.2 / 100m → 0.1

4. 経過時間信頼度:
   - 最終チェックポイントからの経過時間が 60s を超えると線形に低下
   - 60s → 0.8 / 120s → 0.5 / 180s → 0.2

総合ドリフトスコア = Headingスコア × 0.35 + 歩幅スコア × 0.25 + 距離信頼度 × 0.25 + 時間信頼度 × 0.15
```

### 7.2 通知レベル

| 総合スコア | レベル | アクション |
|-----------|--------|-----------|
| ≥ 0.7 | NORMAL | 継続（通知不要） |
| 0.4 〜 0.7 | WARNING | React Native に注意通知（UI 上でインジケータ表示） |
| < 0.4 | CRITICAL | React Native に補正促し通知（UI 上で補正操作を推奨） |

### 7.3 通知から補正までの流れ

```text
DriftDetector: CRITICAL 判定
  → CollectionEventEngine: DriftWarningEvent（level=CRITICAL）
  → Bridge → React Native: 補正促し UI 表示
  → ユーザ: Graph 上で現在位置を再選択
  → Bridge API: correctPosition(newPosition)
  → PathCorrector: 経路評価・補正実行
  → CollectionEventEngine: CorrectionCompletedEvent
  → React Native: 補正完了 UI 表示
```

## 8. 経路補正（Path Correction）

### 8.1 PathCorrector ― 区間信頼性評価

補正操作時、PathCorrector は**直前のチェックポイントから補正位置まで**の区間（補正対象区間）を評価する。

```kotlin
data class SegmentReliability(
    val distance: Float,           // 区間距離（m）
    val duration: Long,            // 区間時間（ms）
    val headingStability: Float,   // Heading 安定性（0.0〜1.0）
    val strideConsistency: Float,  // 歩幅一貫性（0.0〜1.0）
    val sampleCount: Int,          // 区間内サンプル数
    val pdrConfidenceAvg: Float,   // 区間内の平均PDR信頼度
    val overallReliability: Float  // 総合信頼度（0.0〜1.0）
)
```

総合信頼度算出:
```text
overallReliability = headingStability × 0.3
                   + strideConsistency × 0.2
                   + pdrConfidenceAvg × 0.3
                   + distanceFactor × 0.2

distanceFactor = max(0.0, 1.0 - distance / 50.0)
// 50m 以内 → 1.0〜0.0、50m 超 → 0.0（最低）
```

### 8.2 補正戦略の分岐

```text
if (overallReliability >= 0.6) {
    // 比例配分遡及補正（Rubber-band Correction）
    // → 区間内の全Sampleの位置を比例配分で補正
} else {
    // 区間破棄 + ユーザ警告
    // → 区間内の全Sampleを DISCARDED にマーク
    // → ユーザに警告表示（「直近XXmのデータは信頼性が低いため破棄されました」）
}
```

### 8.3 比例配分遡及補正（Rubber-band Correction）

```text
前提:
  - P0: 直前チェックポイントの GraphPosition（補正前、正しいと仮定）
  - P1_old: ユーザが補正操作を行った時点の GraphPosition（PDR推定、ズレあり）
  - P1_new: ユーザが指定した補正後の GraphPosition（Ground Truth）
  - 区間内の Sample 群: S₁, S₂, ..., Sₙ（各Sampleは補正前のgraphPositionを持つ）

補正:
  1. P0 から P1_old までのグラフ上の経路長 L_old を計算
  2. P0 から P1_new までのグラフ上の経路長 L_new を計算
  3. 各 Sample Sᵢ について:
     a. P0 から Sᵢ の補正前位置までのグラフ上距離 dᵢ を計算
     b. 比率 r = dᵢ / L_old を計算
     c. P0 からグラフ上を r × L_new 進んだ位置を Sᵢ の新位置とする
  4. 補正後の全Sampleを VALID のまま SQLite に更新

グラフ上距離の計算:
  - Node → Edge → Node → ... の経路上での実際の長さを用いる
  - Edge の direction（fromNode→toNode / toNode→fromNode）を考慮
```

```text
【補正前】                    【補正後】
P0（CP）                         P0（CP）
  │                                │
  ├── S₁（位置ズレ小）    →        ├── S₁（比例補正）
  ├── S₂（位置ズレ中）    →        ├── S₂（比例補正）
  ├── S₃（位置ズレ大）    →        ├── S₃（比例補正）
  │                                │
P1_old（ズレあり）                P1_new（ユーザ指定 = Ground Truth）
```

### 8.4 破棄時の処理

```text
1. 区間内の全Sampleの status を DISCARDED に更新（物理削除はしない）
2. 破棄区間のメタデータをセッションに記録（discardedSegmentCount++）
3. 新しいチェックポイントを P1_new に生成（MANUAL タイプ）
4. CollectionEventEngine 経由でユーザに警告イベント送信:
   payload: { discardedSampleCount, discardedDistance, reason }
```

## 9. WiFi スキャン密度設計

### 9.1 課題

Android の WiFi スキャン周期は通常 1〜4 秒。歩行速度 1.0〜1.4 m/s の場合、1 スキャン間に 1〜5.6m 移動する。Fingerprint の空間解像度として 2〜3m 間隔が理想的である。

### 9.2 密度確保戦略

| 戦略 | 説明 | 効果 |
|------|------|------|
| **連続スキャン要求** | `WifiManager.startScan()` を可能な限り高頻度で呼出（Android 10+ では4回/2分の制限あり。`WifiAwareManager` またはフォアグラウンドサービスでの制限緩和を検討） | スキャン間隔を 1〜2 秒に短縮 |
| **PDR 補間** | WiFi スキャンとスキャンの間の位置は PDR の歩数単位で補間し、WiFi 特徴量は前後のスキャン結果から線形補間（RSSI は対数スケールのため線形補間の精度は限定的。RSSI の空間的連続性が高い環境では有効） | 空間密度 0.5〜1.0m 相当に向上 |
| **複数パス集約** | 同一区間を複数回歩行し、後工程（09c）で集約。単一パスでの密度不足をカバー | 実効的なサンプル密度向上 |
| **静止サンプリング** | Node 上ではユーザが一時停止し、複数スキャンを蓄積（Node は滞留ポイントとして自然） | Node の特徴量品質向上 |

### 9.3 目標密度

| 空間解像度 | 目標サンプル間隔 | 実現手段 |
|-----------|----------------|---------|
| Edge 上 | 1.0〜2.0m | 連続スキャン + PDR 補間 |
| Node 上 | 複数スキャン集約（5〜10回） | 静止サンプリング |

### 9.4 CollectionRecorder のサンプリングトリガー

```text
CollectionRecorder は以下のトリガーで Sample を生成する:

【WiFi Sample 生成トリガー】
- WiFi スキャン完了時（WifiScanner のコールバック）
  → スキャン時刻の GraphPosition を取得（PDR 補間位置）
  → WifiFeatures を抽出
  → Sample を生成・SQLite 保存

【地磁気 Sample 生成トリガー】
- 一定距離（1.0m）歩行ごと、または一定時間（500ms）ごと
  → 集約ウィンドウ内（直近1秒）の磁気データから MagneticFeatures を抽出
  → Sample を生成・SQLite 保存

【気圧 Sample 生成トリガー】
- 一定時間（5秒）ごと
  → 集約ウィンドウ内（直近5秒）の気圧データから PressureFeatures を抽出
  → Sample を生成・SQLite 保存

※ 各センサーのサンプリング周期が異なるため、Sample はセンサー種別ごとに
   独立して生成される。同一 GraphPosition に複数 Sample が紐づき得る。
   後工程（09c）で統合する。
```

## 10. 特徴量抽出（Feature Extraction）

### 10.1 設計方針

> WiFiや地磁気、気圧データは、絶対情報ではなく、特徴量を取得する

収集時点では**生データ + 特徴量の両方を保存**する。生データは後工程での再処理・デバッグ用、特徴量は Fingerprint DB の直接素材とする。

### 10.2 WifiFeatureExtractor

```text
入力: WifiScanResult（BSSID, RSSI生値, 周波数）
出力: WifiFeatures

処理:
1. RSSI 正規化（デバイス較正プロファイル適用）:
   rssiNormalized = (rssiRaw - calibrationOffset) / referenceRange
   範囲を 0.0（信号なし）〜 1.0（最大強度）に正規化

2. AP フィルタリング:
   - 移動AP（モバイルルーター等）を除外（BSSID OUI 判定またはRSSI変動パターン）
   - RSSI < -90 dBm の極微弱AP は除外（ノイズ）

3. 特徴量ベクトル構築:
   { bssid₁: rssiNormalized₁, bssid₂: rssiNormalized₂, ... }
   スキャンごとに観測された全APの正規化RSSIベクトル
```

### 10.3 MagneticFeatureExtractor

```text
入力: 地磁気生ベクトル（x, y, z, μT）× 集約ウィンドウ
出力: MagneticFeatures

処理:
1. ウィンドウ内の外れ値除去（3σ 超を除外）
2. 平均ベクトル計算 → rawVector
3. 正規化: normalizedVector = rawVector / |rawVector|
4. 水平/鉛直成分分解:
   horizontalIntensity = sqrt(x² + y²)
   verticalIntensity = |z|
5. 異常度計算:
   - 直近の広域ウィンドウ（例: 直近30秒）の平均ベクトルをベースライン
   - 現在ウィンドウの平均ベクトルとベースラインのコサイン距離を anomalyScore とする
   - 0.0（ベースラインと同一）〜 1.0（完全に異なる）
6. 安定性計算:
   - ウィンドウ内の各サンプルのベクトル分散の逆数（正規化）
```

### 10.4 PressureFeatureExtractor

```text
入力: 気圧生値（hPa）× 集約ウィンドウ
出力: PressureFeatures

処理:
1. ウィンドウ内の中央値 → pressureHpa
2. セッション開始時の基準気圧からの差分 → relativePressure
   - 絶対気圧は天候により変動するため、相対値として保持
3. ウィンドウ内の線形回帰傾き → pressureTrend（hPa/min）
   - 急激な変化はエレベータや階段移動を示唆（収集モードでは異常検知に利用）
```

## 11. 端末較正（Device Calibration）

### 11.1 課題

異なる端末（機種・メーカー）で同一 BSSID の RSSI に系統差（5〜15 dBm）が生じる。同一端末でも経年変化があり得る。

### 11.2 較正戦略

```text
【事前較正（オフライン）】
1. リファレンス端末を 1 台選定（プロジェクトの基準端末）
2. 既知の Fingerprint が整備された環境で、較正対象端末とリファレンス端末を
   同一地点で同時に WiFi スキャン（N 地点 × M 回）
3. AP ごとの RSSI 差分の中央値をオフセットとして算出:
   calibrationOffset[bssid] = median(RSSI_reference - RSSI_target)
4. 較正プロファイルを SQLite に保存

【オンライン較正（収集中）】
- 収集開始時、セッションの最初の Node 上でリファレンス RSSI 期待値と
  実測値を比較し、簡易オフセットを算出（粗い較正）
- 十分なサンプルが集まった段階でオフセットを更新

【較正プロファイル】
- Android ネイティブ側 SQLite に保存
- React Native 側、Map Assets Pipeline 側では保持しない
- 収集データに較正プロファイル ID を付与し、後工程での追跡を可能に
```

### 11.3 較正の限界と代替アプローチ

- システム差が大きすぎる端末は収集用として非推奨とし、ユーザに通知
- Fingerprint DB 化（09c）時に RSSI 絶対値ではなく **AP 間の RSSI 差**（差分フィンガープリント）を利用することで端末差の影響を低減

## 12. セッション中断・再開

### 12.1 中断（Pause）

```text
トリガー:
  - ユーザ操作（UI の「一時停止」ボタン）
  - システム割り込み（電話着信 etc.）→ 自動中断

中断時の処理:
1. 現在位置で自動チェックポイントを生成（AUTO_PAUSE タイプ）
2. センサー取得を停止
3. PDR 状態をフリーズ（PdrSnapshot を保持）
4. CollectionSession.status → PAUSED
5. セッション状態を SQLite に永続化
6. CollectionEventEngine: SessionStateEvent（PAUSED）→ React Native
```

### 12.2 再開（Resume）

```text
トリガー: ユーザ操作（UI の「再開」ボタン）

再開時の処理:
1. 最終チェックポイントの GraphPosition を取得
2. ユーザに「現在地が最終チェックポイントの位置と一致しているか」を確認（UI ダイアログ）
   ├→ 一致: 最終チェックポイントから再開
   └→ 不一致: ユーザに現在位置を Graph 上で再選択させる → 新規チェックポイント生成
3. センサー取得を再開
4. PDR を最終チェックポイント位置で初期化
5. CollectionSession.status → ACTIVE
6. CollectionEventEngine: SessionStateEvent（RESUMED）→ React Native
```

### 12.3 永続化保証

- 中断操作は**即座に** SQLite にコミットする（トランザクション）
- アプリ強制終了時も直前の状態が SQLite に残るよう、定期的（30 秒ごと + チェックポイント生成時）に中間状態をフラッシュ

## 13. エラー処理とイベント

### 13.1 収集モードエラー一覧

| エラー種別 | コード | 深刻度 | 対応 |
|-----------|--------|--------|------|
| **WiFi 無効** | `ERR_WIFI_DISABLED` | CRITICAL | ユーザに WiFi 有効化を促す。WiFi なしでは収集不可（地磁気のみでの収集は品質不足） |
| **WiFi スキャン失敗** | `ERR_WIFI_SCAN_FAILED` | WARNING | 連続 N 回失敗で CRITICAL に昇格 |
| **地磁気センサー不在** | `ERR_NO_MAGNETIC` | WARNING | 地磁気 Fingerprint 収集不可。WiFi のみで継続 |
| **気圧センサー不在** | `ERR_NO_PRESSURE` | INFO | 気圧 Fingerprint 収集不可。WiFi+地磁気で継続 |
| **PDR 信頼度 極低** | `ERR_PDR_UNRELIABLE` | CRITICAL | 補正操作を強く推奨。継続も可能だがデータ品質警告 |
| **GPS 信号あり** | `ERR_GPS_ACTIVE` | WARNING | 屋外にいる可能性。屋内収集の確認を促す |
| **センサー許可不足** | `ERR_PERMISSION` | CRITICAL | 必要な権限の付与を促す（設定画面への誘導） |
| **SQLite 書込失敗** | `ERR_STORAGE` | CRITICAL | ストレージ容量確認。セッション自動中断 |
| **Graph データ不在** | `ERR_NO_GRAPH` | CRITICAL | Map Assets の読込確認。収集開始不可 |
| **連続補正過多** | `ERR_TOO_MANY_CORRECTIONS` | WARNING | 短時間に補正が多すぎる場合、環境が収集に適さない可能性を通知 |

### 13.2 イベント構造

```kotlin
data class CollectionEvent(
    val eventId: String,
    val sessionId: String,
    val eventType: CollectionEventType,
    val timestamp: Long,
    val payload: Map<String, Any>
)

enum class CollectionEventType {
    SESSION_STARTED,
    SESSION_PAUSED,
    SESSION_RESUMED,
    SESSION_COMPLETED,
    CHECKPOINT_GENERATED,
    DRIFT_WARNING,          // payload: { level: "WARNING"|"CRITICAL", score: Float }
    CORRECTION_COMPLETED,   // payload: { correctedSampleCount, strategy: "RUBBER_BAND"|"DISCARD" }
    ERROR_OCCURRED          // payload: { code, message, severity }
}
```

## 14. SQLite スキーマ

### 14.1 データベース設計

データベースは Android ネイティブ側（position-engine）の内部ストレージに配置し、React Native および Map Assets Pipeline からは直接アクセスしない。データの外部連携は 09c の Fingerprint DB Pipeline が担当する。

```sql
-- 収集セッション
CREATE TABLE collection_sessions (
    session_id          TEXT PRIMARY KEY,
    building_id         TEXT NOT NULL,
    floor_id            TEXT NOT NULL,
    device_model        TEXT NOT NULL,
    device_manufacturer TEXT NOT NULL,
    android_version     TEXT NOT NULL,
    wifi_chipset        TEXT,
    calibration_profile_id TEXT,
    start_time          INTEGER NOT NULL,
    end_time            INTEGER,
    status              TEXT NOT NULL CHECK(status IN ('ACTIVE','PAUSED','COMPLETED','DISCARDED')),
    total_distance      REAL DEFAULT 0.0,
    sample_count        INTEGER DEFAULT 0,
    checkpoint_count    INTEGER DEFAULT 0,
    correction_count    INTEGER DEFAULT 0,
    discarded_segment_count INTEGER DEFAULT 0,
    metadata_json       TEXT,
    created_at          INTEGER NOT NULL,
    updated_at          INTEGER NOT NULL
);

-- チェックポイント
CREATE TABLE collection_checkpoints (
    checkpoint_id       TEXT PRIMARY KEY,
    session_id          TEXT NOT NULL REFERENCES collection_sessions(session_id),
    sequence_number     INTEGER NOT NULL,
    timestamp           INTEGER NOT NULL,
    position_type       TEXT NOT NULL CHECK(position_type IN ('NODE','EDGE')),
    node_id             TEXT,
    edge_id             TEXT,
    edge_t              REAL,
    from_node_id        TEXT,
    to_node_id          TEXT,
    generation_type     TEXT NOT NULL CHECK(generation_type IN ('AUTO_NODE','AUTO_DISTANCE','AUTO_TIME','AUTO_PAUSE','MANUAL')),
    sample_count_since_last INTEGER DEFAULT 0,
    distance_since_last REAL DEFAULT 0.0,
    pdr_confidence      REAL,
    created_at          INTEGER NOT NULL
);

-- 収集サンプル（メイン）
CREATE TABLE collection_samples (
    sample_id           TEXT PRIMARY KEY,
    session_id          TEXT NOT NULL REFERENCES collection_sessions(session_id),
    sequence_number     INTEGER NOT NULL,
    timestamp           INTEGER NOT NULL,
    position_type       TEXT NOT NULL CHECK(position_type IN ('NODE','EDGE')),
    node_id             TEXT,
    edge_id             TEXT,
    edge_t              REAL,
    from_node_id        TEXT,
    to_node_id          TEXT,
    local_x             REAL NOT NULL,
    local_y             REAL NOT NULL,
    floor_id            TEXT NOT NULL,
    status              TEXT NOT NULL CHECK(status IN ('VALID','DISCARDED','INTERPOLATED')),
    has_wifi            INTEGER NOT NULL DEFAULT 0,
    has_magnetic        INTEGER NOT NULL DEFAULT 0,
    has_pressure        INTEGER NOT NULL DEFAULT 0,
    pdr_snapshot_json   TEXT,
    created_at          INTEGER NOT NULL
);

CREATE INDEX idx_samples_session ON collection_samples(session_id, sequence_number);
CREATE INDEX idx_samples_session_status ON collection_samples(session_id, status);

-- WiFi 特徴量（1 Sample に 1 件。AP情報は子テーブルに分割）
CREATE TABLE collection_wifi_samples (
    sample_id           TEXT PRIMARY KEY REFERENCES collection_samples(sample_id),
    scan_timestamp      INTEGER NOT NULL,
    scan_duration_ms    INTEGER NOT NULL,
    ap_count            INTEGER NOT NULL
);

CREATE TABLE collection_wifi_aps (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    sample_id           TEXT NOT NULL REFERENCES collection_wifi_samples(sample_id),
    bssid               TEXT NOT NULL,
    ssid                TEXT,
    rssi_raw            INTEGER NOT NULL,
    rssi_normalized     REAL NOT NULL,
    frequency           INTEGER NOT NULL,
    is_calibrated       INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_wifi_aps_sample ON collection_wifi_aps(sample_id);
CREATE INDEX idx_wifi_aps_bssid ON collection_wifi_aps(bssid);

-- 地磁気特徴量
CREATE TABLE collection_magnetic_samples (
    sample_id           TEXT PRIMARY KEY REFERENCES collection_samples(sample_id),
    raw_x               REAL NOT NULL,
    raw_y               REAL NOT NULL,
    raw_z               REAL NOT NULL,
    normalized_x        REAL NOT NULL,
    normalized_y        REAL NOT NULL,
    normalized_z        REAL NOT NULL,
    magnitude           REAL NOT NULL,
    horizontal_intensity REAL NOT NULL,
    vertical_intensity  REAL NOT NULL,
    anomaly_score       REAL NOT NULL,
    stability           REAL NOT NULL,
    sample_window_ms    INTEGER NOT NULL
);

-- 気圧特徴量
CREATE TABLE collection_pressure_samples (
    sample_id           TEXT PRIMARY KEY REFERENCES collection_samples(sample_id),
    pressure_hpa        REAL NOT NULL,
    relative_pressure   REAL NOT NULL,
    pressure_trend      REAL NOT NULL,
    confidence          REAL NOT NULL
);

-- 端末較正プロファイル
CREATE TABLE calibration_profiles (
    profile_id          TEXT PRIMARY KEY,
    device_model        TEXT NOT NULL,
    device_manufacturer TEXT NOT NULL,
    reference_device    TEXT NOT NULL,
    created_at          INTEGER NOT NULL,
    updated_at          INTEGER NOT NULL
);

CREATE TABLE calibration_wifi_offsets (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id          TEXT NOT NULL REFERENCES calibration_profiles(profile_id),
    bssid               TEXT NOT NULL,
    rssi_offset         REAL NOT NULL,  -- referenceRSSI - targetRSSI の中央値
    sample_count        INTEGER NOT NULL,
    std_dev             REAL NOT NULL,
    UNIQUE(profile_id, bssid)
);

-- 破棄区間記録
CREATE TABLE collection_discarded_segments (
    segment_id          TEXT PRIMARY KEY,
    session_id          TEXT NOT NULL REFERENCES collection_sessions(session_id),
    from_checkpoint_id  TEXT NOT NULL REFERENCES collection_checkpoints(checkpoint_id),
    to_checkpoint_id    TEXT NOT NULL REFERENCES collection_checkpoints(checkpoint_id),
    distance_m          REAL NOT NULL,
    duration_ms         INTEGER NOT NULL,
    sample_count        INTEGER NOT NULL,
    discard_reason      TEXT NOT NULL,
    discarded_at        INTEGER NOT NULL
);
```

### 14.2 ストレージ見積もり

| 項目 | 1サンプルあたりサイズ（概算） | 備考 |
|------|--------------------------|------|
| collection_samples 行 | ~200 B | 基本情報 |
| WiFi: AP 10個の場合 | ~500 B | BSSID 17文字 × 10 + 数値 |
| 地磁気 | ~150 B | 数値 10個 |
| 気圧 | ~100 B | 数値 4個 |
| **1サンプル合計** | **~1 KB** | 全センサーありの場合 |

- 1 セッション（例: 100m 歩行、1m 間隔 + Node 数点）: ~100 samples → ~100 KB
- 1 建物 10 セッション: ~1 MB
- 十分に軽量であり、モバイル端末のストレージに問題なく収まる

## 15. Position Controller へのモード切替追加

既存の Position Controller（`06_position-engine.md` §3）に以下の状態と API を追加する。

### 15.1 追加状態

```text
NotInitialized → Initialized → Positioning（既存）/ Collecting（新規）
                                  ↓
                              Paused（共通）
                                  ↓
                              Stopped
```

### 15.2 追加 API

| API | 方向 | 説明 |
|-----|------|------|
| `startCollection(config)` | RN → Kotlin | 収集セッション開始。config: { buildingId, floorId, startPosition(GraphPosition) } |
| `pauseCollection()` | RN → Kotlin | 収集セッション一時中断 |
| `resumeCollection(confirmedPosition?)` | RN → Kotlin | 収集セッション再開。confirmedPosition 省略時は最終チェックポイントから再開 |
| `correctPosition(newPosition)` | RN → Kotlin | 現在位置補正。newPosition: GraphPosition |
| `stopCollection(endPosition)` | RN → Kotlin | 収集セッション終了。endPosition: GraphPosition |

### 15.3 モード切替ルール

- Positioning Mode と Collection Mode は**排他**。一方が Running の場合、他方は開始不可。
- モード切替には必ず現在のモードを `stop()` してから他方を `initialize()` する。
- 収集セッションが PAUSED の間はセンサーを停止するが、セッションは破棄されない。
