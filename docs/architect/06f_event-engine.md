# 06f. Event Engine（イベント管理・通知エンジン）

## 1. 本節の目的

Event Engine は Android Position Engine の最終段に位置し、Indoor Map Matching Engine が生成した最終位置情報を監視し、React Native へ通知すべきイベントを生成・制御する。**ポーリング方式は採用せず、イベント駆動方式**により Bridge 通信量・UI 更新回数・バッテリー消費を削減する。

> **責務境界**: 本書は **Position Engine 内部**のイベント制御機構（ChangeDetector / EventFilter / EventQueue / EventDispatcher など内部コンポーネントの実装詳細）を定義する。システム全体の通信アーキテクチャ（コンポーネント間の通信方式選定・イベントの抽象分類・非同期設計方針）は `08_event-communication.md` を参照。

## 2. 責務

| 担当 | 非担当 |
|-----|-------|
| 位置変化の監視 | センサー取得 |
| イベント発火判定 | PDR / Fingerprint |
| 差分検出 | Position Fusion / Map Matching |
| イベントの統合・抑制（Debounce / Throttle） | UI 更新 |
| React Native Bridge へのイベント通知 | |

## 3. 設計思想

### 3.1 イベント駆動を採用

Position Engine は常時動作するが、React Native へ毎回位置を通知しない。通知するのは**「意味のある状態変化」**のみ。

### 3.2 Bridge 通信を最小化

Android ↔ React Native 間の Bridge 通信は最も高コスト。不要なイベントは Event Engine 内部で吸収する。

### 3.3 UI を認識しない

React Native の画面状態を知らず、通知のみ行う。描画タイミングは React Native 側が管理する。

## 4. モジュール構成

```text
EventEngine
├── EventCollector       ← Indoor Map Matching から最新位置取得
├── ChangeDetector       ← 前回状態との差分判定（Position/Heading/Floor/Confidence）
├── EventFilter          ← イベント抑制（数cm移動/1°Heading変化/微小Confidence変化→非通知、Floor変更→即通知）
├── EventDispatcher      ← React Native Bridge へ送信。Bridge 詳細は知らず Dispatcher Interface 経由
├── EventQueue           ← 送信順序保証（Position→Heading→Floor の順）
└── EventStateManager    ← Last Position/Heading/Floor/Confidence/Dispatch Time 保持
```

## 5. イベント種類

| イベント | トリガー |
|---------|---------|
| **PositionChanged** | 一定距離以上の移動 |
| **HeadingChanged** | 一定角度以上の変化 |
| **FloorChanged** | 階変更（即通知） |
| **ConfidenceChanged** | 信頼度の閾値変化 |
| **EngineStatusChanged** | Running / Paused / Stopped 遷移 |
| **ErrorOccurred** | Wi-Fi 利用不可 / 権限不足 / Assets 読込失敗 |

## 6. イベントデータモデル

共通形式 `{ eventType, timestamp, payload }`。payload はイベント種別ごとに異なる：

| イベント | Payload |
|---------|---------|
| PositionChanged | `{ Position, Heading, Floor, Confidence }` |
| ErrorOccurred | `{ Code, Message, Recoverable }` |

## 7. イベント発火条件

| 種類 | 条件 | 備考 |
|------|------|------|
| Position | 一定距離以上移動 | 閾値設定可能 |
| Heading | 一定角度以上変化 | 閾値設定可能 |
| Floor | 変更時 | 即通知 |
| Confidence | `level` が HIGH↔MEDIUM↔LOW 間で遷移 | `value` 変化のみで `level` 不変の場合は非通知 |

### 7.1 Confidence イベントの閾値

Confidence の `level` は `value` から以下の閾値で自動導出される（`06_position-engine.md` §9 参照）：

| level | value 範囲 |
|-------|-----------|
| HIGH | value ≥ 0.7 |
| MEDIUM | 0.4 ≤ value < 0.7 |
| LOW | value < 0.4 |

`level` に変化があった場合のみ `ConfidenceChanged` イベントを発火する。`value` が変化しても `level` が同じ場合は通知しない（例：0.72 → 0.85 は両方 HIGH のため抑制）。

## 8. 抑制制御

| 制御 | 内容 |
|------|------|
| **Debounce** | 短時間の大量イベント（100ms 内 5 回更新→1 回通知） |
| **Throttle** | 最小通知間隔（20ms 間隔→100ms 間隔に間引く） |
| **Level 不変抑制** | Confidence の `value` が変化しても `level` が同一なら ConfidenceChanged は発火しない |

## 9. イベント優先度

```text
Error > Floor > Position > Heading > Confidence
```

重要イベントは即送信する。

## 10. イベントフロー

```text
Indoor Map Matching → Event Collector → Change Detector → Event Filter
                   → Event Queue → Event Dispatcher → React Native Bridge → React Native
```

## 11. React Native 側の責務

イベント受信後、React Native は `Store 更新 → MapLibre Marker 更新 → UI 再描画` の流れで処理。Position Engine は描画処理を一切行わない。

## 12. エラーイベントレベル

| 状況 | レベル | Engine 操作 |
|------|--------|------------|
| Sensor Permission 不足 | Error Event | 継続不能のため React Native が `stop()` を発行 |
| Wi-Fi Disabled | Warning Event | 縮退運転（PDR のみ） |
| Map Assets 読込失敗 | Fatal Event | 初期化失敗のため Engine 未起動 |
| MapLibre 描画不能（地図タイル読込不可・WebGL 喪失） | Fatal Event | React Native が `stop()` を発行（地図なしでの測位は無意味） |

> **MapLibre 障害時の注意**: このエラーは Position Engine 内部では検知できない（Engine は UI を認識しないため）。React Native 側が MapLibre の障害を検知し、Bridge API 経由で `stop()` を呼び出す。詳細は `07_react-native-layer.md` §7 参照。

## 13. プラットフォーム非依存設計（推奨）

EventDispatcher を Interface として定義し、実装を分離する：

```text
EventEngine → EventDispatcher（Interface）
                  ├── ReactNativeDispatcher
                  ├── AndroidUIDispatcher（将来の Compose 版）
                  └── TestMockDispatcher
```

この構成は Clean Architecture の依存性逆転の原則（DIP）に沿い、React Native / Compose / iOS / Web / 単体テストのいずれでも Event Engine 本体を変更せず利用可能となる。
