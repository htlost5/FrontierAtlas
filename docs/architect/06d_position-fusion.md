# 06d. Position Fusion Engine（測位統合エンジン）

## 1. 本節の目的

Position Fusion Engine は、PDR Engine・Fingerprint Engine（および将来の測位手法）から得られる測位結果を統合し、**最終的な推定位置（Estimated Position）**を生成する。Position Engine 全体の**意思決定層**と位置付ける。

## 2. 責務

| 担当 | 非担当 |
|-----|-------|
| PDR の相対移動量を取得 | センサー取得 |
| Fingerprint の位置候補を取得 | Wi-Fi スキャン |
| 各測位手法の信頼度を評価 | Fingerprint 照合 |
| 複数測位結果の統合 | PDR 計算 |
| 最終位置の決定 | UI 更新 |
| Map Matching Engine へ位置候補を渡す | React Native 通信 |
| Event Engine へ位置更新を通知 | |

## 3. 設計思想

### 3.1 測位アルゴリズムを独立させる

各 Engine が計算した結果のみを利用し、自身では測位アルゴリズムを実装しない。PDR・Fingerprint・将来の BLE Engine 等は互いを認識しない。

### 3.2 Confidence ベースの統合

固定ルールではなく各 Engine の Confidence を基に重み付けを行う。ある環境では Wi-Fi 優先、別の環境では PDR 優先、といった柔軟な判断を可能にする。

### 3.3 拡張性

新測位手法の追加は Fusion Engine の入力を追加するのみ。既存アルゴリズムの変更は不要。

## 4. モジュール構成

```text
PositionFusionEngine
├── InputCollector        ← 各測位 Engine から入力を収集
├── ConfidenceEvaluator   ← 各入力の信頼度評価（PDR: ドリフト/歩行時間/Heading安定性、FP: RSSI一致率/磁気一致率/AP数）
├── FusionCalculator      ← 複数測位結果の統合（Strategy パターンで交換可能）
├── PositionEstimator     ← 最終位置生成（Position/Heading/Floor/Confidence）
├── PositionValidator     ← 異常値検出（異常速度/急激な位置変化/不正なFloor遷移/信頼度急低下→前回位置維持or信頼度低下）
└── FusionStateManager    ← 状態管理（Current/Previous Position, Confidence, Active Sensors, Last Update Time）
```

## 5. 入出力

**PDR 入力**: `{ deltaX, deltaY, Heading, Confidence }`
**Fingerprint 入力**: `{ Candidate List, Confidence, Floor }`

**出力**（Map Matching Engine へ）:
```text
EstimatedPosition { Position, Heading, Floor, Confidence, Timestamp }
```

## 6. データフロー

```text
PDR ─────┐
         ├→ InputCollector → ConfidenceEvaluator → FusionCalculator
Fingerprint ┘                                      ↓
                                            PositionEstimator
                                                   ↓
                                            PositionValidator
                                                   ↓
                                            EstimatedPosition
```

## 7. Confidence の利用

Position Fusion Engine は PDR と Fingerprint から受け取った `Confidence.value`（0.0〜1.0）を重みとして扱う：

| PDR Confidence | Fingerprint Confidence | 結果 |
|---------------|----------------------|------|
| value ≥ 0.7 (HIGH) | value < 0.4 (LOW) | PDR の移動量を優先（PDR 重み大） |
| value < 0.4 (LOW) | value ≥ 0.7 (HIGH) | Fingerprint 候補を優先（FP 重み大） |
| 両者 MEDIUM 以上 | value 比で按分 | 重み付き平均 |

Fusion 自身も統合結果に対して統一 Confidence 型を出力する。統合後の `value` は入力の重み付き調和平均を基本とし、FusionCalculator の実装によって変更可能。

重み付けの具体的な数式は交換可能（Strategy パターン）。

## 8. FusionCalculator の交換可能実装

- 重み付き平均（Weighted Fusion）
- ベイズ推定
- カルマンフィルタ（Kalman Filter）
- パーティクルフィルタ（Particle Filter）

研究段階ではアルゴリズム比較を容易にするため、設定だけで切り替えられる構成とする。

## 9. 他レイヤとの関係

- **PDR**: 相対位置のみ提供。Fusion が絶対位置へ変換。PDR は Fusion を認識しない。
- **Fingerprint**: 位置候補のみ提供。どの候補を採用するかは Fusion が決定。Fingerprint は PDR を認識しない。
- **Map Matching**: Fusion が生成した位置はまだ建物構造を考慮していない。Map Matching が通路・部屋・壁・Node・Edge を利用して補正する。
- **React Native**: 認識しない。`Map Matching → Event Engine → Bridge → React Native` で通知。

## 10. エラー処理

| 状況 | 対応 |
|------|------|
| PDR 停止 | Fingerprint のみ利用 |
| Wi-Fi 利用不可 | PDR＋地磁気 |
| 地磁気利用不可 | PDR＋Wi-Fi |
| Fingerprint 全停止 | PDR 継続、Confidence 低下 |


## 11. Position Engine 全体での位置付け

```text
Sensor Layer → PDR Engine → Fingerprint Engine → Position Fusion Engine
  → Map Matching Engine
    → Event Engine
      → Bridge → React Native
```

Position Fusion は**測位システム全体の中核**として各測位結果を統合する役割を担う。
