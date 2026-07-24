# 10. 共通データモデル

## 1. 本書について

本ドキュメントは FrontierAtlas システム全体で共有されるデータモデルを一元定義する。
各サブシステムの詳細データモデルは該当ドキュメントを参照すること。

---

## 2. Confidence（信頼度）

全サブエンジンが統一して使用する信頼度型。数値（Fusion の重み付け計算用）とラベル（Event 発火判定用）を併せ持つハイブリッド型。

### 2.1 データ型

```
Confidence {
    value: Float    // 0.0（信頼不能）〜 1.0（完全確信）
    level: Level    // value から自動導出
}

Level {
    HIGH    // value ≥ 0.7
    MEDIUM  // 0.4 ≤ value < 0.7
    LOW     // value < 0.4
}
```

### 2.2 設計意図

| フィールド | 用途 | 消費者 |
|-----------|------|--------|
| `value`（数値） | Fusion の重み付け計算、Map Matching の補正計算 | Position Fusion, Map Matching |
| `level`（ラベル） | イベント発火判定、UI 表示 | Event Engine, React Native |

### 2.3 Confidence の流れ

```
PDR.Confidence ──────────┐
                         ├── FusionCalculator（value ベース重み付け）
Fingerprint.Confidence ──┘        │
                                   ▼
                          Fusion.Confidence
                                   │
                                   ▼
                          Map Matching（value に補正係数を乗算）
                                   │
                                   ▼
                          Final.Confidence → Event Engine（level 変化を検知）
```

### 2.4 定義元

`06_position-engine.md` §9

---

## 3. GraphPosition（グラフ上の位置表現）

Navigation Graph 上の位置を表現する型。収集モードの Ground Truth 指定・Map Matching の補正先指定に利用。

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

### 定義元

`09a_collection-engine.md` §4.2

---

## 4. LocalPosition（ローカル座標）

建物原点からのメートル単位の位置。

```kotlin
data class LocalPosition(
    val x: Float,       // ローカル座標系 X（m）
    val y: Float,       // ローカル座標系 Y（m）
    val floorId: String
)
```

### 定義元

`09a_collection-engine.md` §4.3

---

## 5. Event（イベント共通型）

全イベントの基底型。

```
Event {
    id: String         // 一意なイベントID
    type: EventType    // PositionChanged | HeadingChanged | FloorChanged | ConfidenceChanged | EngineStatusChanged | ErrorOccurred
    timestamp: Long    // epoch ms
    payload: Object    // イベント種別ごとに異なる
}
```

### イベント種別とペイロード

| イベント | Payload |
|---------|---------|
| **PositionChanged** | `{ Position, Heading, Floor, Confidence }` |
| **HeadingChanged** | `{ Heading, Confidence }` |
| **FloorChanged** | `{ Floor, Confidence }` |
| **ConfidenceChanged** | `{ Confidence }` |
| **EngineStatusChanged** | `{ Status: Running | Paused | Stopped }` |
| **ErrorOccurred** | `{ Code, Message, Recoverable }` |

### 定義元

`06f_event-engine.md` §5〜§6

---

## 6. RelativePosition（相対位置）

PDR Engine の出力型。絶対座標ではなく前回位置からの移動量。

```
RelativePosition {
    deltaX: Float
    deltaY: Float
    heading: Float       // 度
    stepCount: Int
    estimatedStride: Float // m
    confidence: Confidence
    timestamp: Long
}
```

### 定義元

`06b_pdr-engine.md` §4

---

## 7. FingerprintResult（指紋照合結果）

Fingerprint Engine の出力型。

```
FingerprintResult {
    Candidates: List<Position>  // 候補位置リスト
    Confidence: Confidence
    Floor: String
    Timestamp: Long
    Source: "Wi-Fi" | "Magnetic" | "Hybrid"
}
```

### 定義元

`06c_fingerprint-engine.md` §5

---

## 8. EstimatedPosition（推定位置）

Position Fusion Engine の出力型。

```
EstimatedPosition {
    Position: LocalPosition
    Heading: Float
    Floor: String
    Confidence: Confidence
    Timestamp: Long
}
```

### 定義元

`06d_position-fusion.md` §5

---

## 9. MatchedPosition（補正後位置）

Indoor Map Matching Engine の出力型。最終的な位置情報。

```
MatchedPosition {
    Position: LocalPosition
    Heading: Float
    Floor: String
    MatchedEdge: String?
    MatchedNode: String?
    Confidence: Confidence
}
```

### 定義元

`06e_map-matching.md` §5

---

## 10. SensorSample（センサーサンプル共通型）

Sensor Layer が出力する全センサーの共通形式。

```
SensorSample {
    timestamp: Long
    sensorType: SensorType
    values: Float[]
    accuracy: Int
}
```

### 定義元

`06a_sensor-layer.md` §6
