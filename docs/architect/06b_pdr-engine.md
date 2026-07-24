# 06b. PDR Engine（Pedestrian Dead Reckoning）

## 1. 本節の目的

PDR Engine は、スマートフォンの慣性センサーを用いて利用者の移動量と進行方向を推定し、**前回の位置からの相対移動**を計算する。単独で絶対位置推定に利用するのではなく、Wi-Fi Fingerprint や地磁気 Fingerprint と組み合わせるための**連続的な移動推定エンジン**として位置付ける。

## 2. 責務

| 担当 | 非担当 |
|-----|-------|
| 歩行開始・停止の判定 | 絶対位置の決定 |
| 歩数推定・歩幅推定 | Wi-Fi Fingerprint 照合 |
| Heading（進行方向）推定 | 地磁気 Fingerprint 照合 |
| 相対移動量の計算・相対位置の更新 | Map Matching |
| Position Fusion への入力生成 | UI 更新 |

## 3. 設計思想

### 3.1 相対位置推定専用

PDR は「現在位置」を決定するものではなく、「前回位置からどれだけ移動したか」を推定する。初期位置や定期的な補正は他の測位手法に依存する。

### 3.2 ドリフトを前提とする

PDR は積算誤差（ドリフト）が避けられない。完全に排除するのではなく、Wi-Fi・地磁気・Map Matching による補正を前提とする。

### 3.3 センサー入力の抽象化

Sensor Layer が提供する共通データモデルのみを利用し、Android の `SensorManager` やセンサー API を直接参照しない。

## 4. 入出力

| 入力 | 用途 |
|------|------|
| 加速度 | 歩行検出・歩数推定 |
| ジャイロ | 姿勢変化の把握 |
| 回転ベクトル | Heading 推定 |
| 地磁気 | 方位補正 |
| タイムスタンプ | 時系列同期 |

出力は絶対座標ではない：

```text
RelativePosition { deltaX, deltaY, heading, stepCount, estimatedStride, confidence, timestamp }
```

## 5. モジュール構成

```text
PdrEngine
├── StepDetector              ← 歩行開始/停止判定・歩数検出
├── StrideEstimator           ← 歩幅推定（初期は固定値、将来は動的推定）
├── HeadingEstimator          ← 進行方向推定（回転ベクトル+ジャイロ+地磁気）
├── RelativePositionCalculator ← 歩幅×方向から ΔX, ΔY 算出
├── DriftEstimator            ← 信頼度管理（長時間補正なし/急激な方向転換/精度低下を検知）
└── PdrStateManager           ← 状態管理（歩数・Heading・相対位置・Confidence）
```

## 6. データフロー

```text
Sensor Layer → StepDetector → StrideEstimator → HeadingEstimator
            → RelativePositionCalculator → DriftEstimator → RelativePosition
```

## 7. 状態遷移

```text
Idle → Walking ⇄ Temporary Stop → Stopped
```

| 状態 | 説明 |
|-----|------|
| Idle | 初期状態。歩行していない |
| Walking | 歩行中。相対位置を更新 |
| Temporary Stop | 一時停止（エレベータ待ち等）。内部状態は保持 |
| Stopped | 長時間停止。歩数更新を停止 |

## 8. ドリフト管理

一定距離移動後や一定時間経過後に Position Fusion が補正を実施。PDR 自身は補正を行わない。壁や通路を認識せず、壁を横切るような相対移動が計算される可能性がある補正は Map Matching Engine が担当する。

## 9. Confidence（信頼度）

PDR は統一 Confidence 型（`06_position-engine.md` §9 参照）を出力する。算出は以下の加重評価による：

| 評価要素 | 重み | 説明 |
|---------|------|------|
| センサー品質 | 30% | 加速度・ジャイロの accuracy 値（Android SensorManager が報告する精度） |
| 無補正継続時間 | 25% | Fingerprint による補正なしでの経過時間が長いほど値は低下 |
| Heading 安定性 | 25% | 直近 N 秒間の Heading 推定値の分散が小さいほど高い |
| ドリフト推定値 | 20% | DriftEstimator が出力する累積誤差推定値 |

各要素を 0.0〜1.0 に正規化し、重み付き平均で `value` を算出。`level` は `value` から自動導出される。

Position Fusion はこの `value` を重み付け計算に利用する。

## 10. 他レイヤとの関係

- **Position Fusion**: RelativePosition を提供。絶対位置は決定しない。PDR は Fusion Engine の存在を認識しない。
- **Map Matching**: 壁貫通などの補正は Map Matching が担当。PDR は補正前の移動量のみ提供。
- **React Native**: 直接利用しない。出力は `Position Fusion → Map Matching → Event → Bridge → React Native` の経路で通知。
