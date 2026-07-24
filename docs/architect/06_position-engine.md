# 06. Android Position Engine

## 1. Position Engine の役割

Position Engine は FrontierAtlas の中核コンポーネントであり、スマートフォンのセンサーデータを統合し、利用者の屋内位置を推定する。測位処理のすべてを Kotlin ネイティブ側へ集約し、React Native 側には推定結果のみを通知する。

| 責務（担当） | 責務外（非担当） |
|------------|---------------|
| センサー取得（加速度・ジャイロ・地磁気・気圧・コンパス） | 地図描画 |
| Wi-Fi スキャン | MapLibre の操作 |
| PDR（Pedestrian Dead Reckoning） | 画面更新 |
| Heading 推定 | ナビゲーション UI |
| Fingerprint 照合（Wi-Fi・地磁気） | GeoJSON 編集 |
| Position Fusion | データ更新処理 |
| Map Matching | |
| 信頼度推定 | |
| React Native へのイベント通知 | |

## 2. 設計思想

### 2.1 UI から完全に独立

Position Engine は UI を一切認識しない。React Native が存在しなくても単体で動作可能。知るのは「初期化・開始・停止・イベント通知」のみ。

### 2.2 イベント駆動

自律的に常時測位を継続し、意味のある状態変化（位置更新・階変更・向き変更・推定精度変化）が発生した場合のみイベントを送信。微小な変化は内部で吸収し、Bridge 通信量・UI 更新回数・バッテリー消費を削減する。

### 2.3 センサーとアルゴリズムの分離

SensorManager・PDR Engine・Wi-Fi Engine・Geomagnetic Engine を独立実装。新しい測位手法の追加時も既存実装への影響を最小限に抑える。

### 2.4 データ駆動

測位アルゴリズムは建物固有の値を持たない。Map Assets から GeoJSON・Wi-Fi Fingerprint・地磁気 Fingerprint・Navigation Graph を読み込む。建物追加はデータ追加のみで完結。

## 3. 内部レイヤ構成

```text
┌──────────────────────────────────────────────┐
│              React Native Bridge             │
└──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│             Position Controller              │
└──────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
 Sensor Layer   Position Layer  Event Layer
        │           │           │
        ▼           ▼           ▼
 Infrastructure  Fusion Engine  Dispatcher
```

### 各レイヤの責務

| レイヤ | 責務 |
|-------|------|
| **React Native Bridge** | React Native との通信（初期化・API 受付・EventEmitter）。測位処理は一切行わない |
| **Position Controller** | Engine 全体の統括（初期化・ライフサイクル管理・各モジュール起動・状態管理） |
| **Sensor Layer** | Android センサー管理（加速度・ジャイロ・地磁気・気圧・Wi-Fi・コンパス）。取得のみ、位置計算は行わない |
| **Position Layer** | 位置推定アルゴリズム（PDR・Wi-Fi Fingerprint・地磁気 Fingerprint・Fusion・Map Matching） |
| **Event Layer** | イベント管理（差分判定・イベント抑制・EventEmitter） |
| **Infrastructure Layer** | OS 連携（SensorManager・WifiManager・FileSystem・Database） |

## 4. ライフサイクル

```text
NotInitialized → Initialized → Running ⇄ Paused → Stopped
```

| 状態 | 説明 | 遷移トリガー |
|-----|------|------------|
| **NotInitialized** | まだ何も読み込まれていない | — |
| **Initialized** | Map Assets を読み込み、各モジュールを生成 | `initialize()` |
| **Running** | センサー取得・測位を実施。イベント発火 | `start()` |
| **Paused** | センサー停止。内部状態は保持 | `pause()` / MapLibre 一時障害 / Fingerprint DB 読込失敗 |
| **Stopped** | 全リソース解放 | `stop()` / MapLibre 致命的障害（地図描画不能） |

> **注**: MapLibre 障害時は React Native 側が Bridge API 経由で `stop()` を呼び出す。Position Engine は自律的に停止判断を行わない。障害の重大度に応じて `pause()`（一時障害・復旧見込みあり）か `stop()`（致命的・要再初期化）かを React Native 側が選択する。

## 5. 保持する内部状態

- 現在位置・現在フロア・Heading・歩数
- 推定精度・Confidence
- 現在利用中 Building・Fingerprint
- 最終イベント送信位置

これらは UI に直接公開せず、イベントまたは API を介して通知する。

## 6. Map Assets との関係

Position Engine は Map Assets を読み取り専用で利用する。読み込み対象：Wi-Fi Fingerprint・地磁気 Fingerprint・Navigation Graph・Metadata・Floor 情報。GeoJSON の編集や生成は行わない。

## 7. React Native との関係

React Native は Bridge API（`initialize()` → `start()` → Event 受信 → UI 更新）のみを利用し、Position Engine の内部構造を認識しない。詳細は `07_react-native-layer.md` 参照。

## 8. サブレイヤ詳細設計

Position Engine の各サブレイヤの詳細設計は以下のファイルを参照：

| サブレイヤ | ファイル | 内容 |
|----------|---------|------|
| Sensor Layer | `06a_sensor-layer.md` | センサー取得・正規化・バッテリー最適化・エラー局所化 |
| PDR Engine | `06b_pdr-engine.md` | 歩行検出・歩幅推定・Heading推定・相対移動量計算・ドリフト管理 |
| Fingerprint Engine | `06c_fingerprint-engine.md` | Wi-Fi/地磁気 Fingerprint 照合・候補位置生成・類似度計算 |
| Position Fusion | `06d_position-fusion.md` | 複数測位結果の統合・Confidence ベース重み付け・最終位置決定 |
| Indoor Map Matching | `06e_map-matching.md` | 建物構造制約による位置補正・通路/部屋/階制約 |
| Event Engine | `06f_event-engine.md` | イベント駆動通知・差分検出・Debounce/Throttle 制御 |

## 9. 共通データモデル：Confidence（信頼度）

全サブエンジンが統一して使用する Confidence 型を定義する。数値（Fusion の重み付け計算用）とラベル（Event 発火判定用）を併せ持つハイブリッド型とする。

### 9.1 データ型

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

### 9.2 設計意図

| フィールド | 用途 | 消費者 |
|-----------|------|--------|
| `value`（数値） | Fusion の重み付け計算、Map Matching の補正計算 | Position Fusion, Map Matching |
| `level`（ラベル） | イベント発火判定、UI 表示 | Event Engine, React Native |

### 9.3 Confidence の流れ

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

各サブエンジンの Confidence 算出方法の詳細は `06b`〜`06f` を参照。
