# 08. 通信・イベント設計

## 1. 設計目標

> **責務境界**: 本書は **システム全体**の通信アーキテクチャ（コンポーネント間の通信方式選定・イベントの抽象分類・非同期設計方針）を定義する。Position Engine 内部の具体的なイベント制御機構（発火条件・抑制実装・キューイング）は `06f_event-engine.md` を参照。

- コンポーネント間の疎結合
- イベント駆動による効率的な通信
- 非同期処理の徹底
- Bridge 通信量の削減
- 高い保守性・拡張性

## 2. 通信方式一覧

| 通信対象 | 通信方式 | 備考 |
|---------|---------|------|
| React Native → Kotlin | API Call | 命令のみ（状態取得は行わない） |
| Kotlin → React Native | Event | Push 型（意味のある変化のみ通知） |
| React Native → MapLibre | Store 更新 | State 変更検知で再描画 |
| Map Assets 更新 | Download | GitHub Releases 経由 |
| GitHub Releases | HTTPS | Manifest・ZIP 取得 |

## 3. 通信原則

### 3.1 Pull を最小限にする
React Native は定期取得（ポーリング）を行わない。必要な情報のみイベントで受信する。

### 3.2 Push を基本とする
Position Engine は意味のある変化（Floor 変更・位置更新・Route 変更）のみ通知。毎秒位置送信は行わない。

### 3.3 API は命令のみ
React Native → Position Engine は命令（`initialize()` / `start()` / `pause()` / `resume()` / `stop()` / `loadAssets()`）のみ。状態取得 API を乱用しない。

## 4. システム全体の通信図

```text
【命令方向】
React Native → Bridge API → Position Controller → Position Engine

【通知方向】
Position Engine → Event Engine → Bridge → Store → MapLibre → UI
```

API による命令と、イベントによる通知を明確に分離する。

## 5. イベント分類

イベントは以下の3系統に大別される。各系統の具体的なイベント種別・発火条件は `06f_event-engine.md` §5〜§7 を参照。

| 分類 | 説明 | 詳細定義 |
|-----|------|---------|
| **System Event** | ライフサイクル管理（Initialize, Ready, Shutdown 等） | `06f_event-engine.md` §5 |
| **Position Event** | 位置情報の変化通知（PositionChanged, HeadingChanged, FloorChanged, ConfidenceChanged 等） | `06f_event-engine.md` §5 |
| **Error Event** | エラー通知（Code/Message/Recoverable） | `06f_event-engine.md` §12 |

## 6. イベント構造

すべてのイベントは共通形式 `Event { id, type, timestamp, payload }` に従う。イベント種別により payload のみ変化する。共通型定義は `10_shared-data-models.md` §5、各イベントのペイロード仕様は `06f_event-engine.md` §6 を参照。

## 7. イベント優先度と抑制（方針）

**優先度方針**: 重要イベント（Error / Floor 変更）は即時送信、低優先イベント（微小な位置変化）は抑制する。具体的な優先順位・閾値・抑制機構（Debounce / Throttle）の実装は `06f_event-engine.md` §8〜§9 を参照。

## 8. Position Engine 内部通信

```text
Controller → Sensor → PDR → Fingerprint → Fusion → Map Matching → Event
```

各 Engine 同士は直接通信しない。Controller が一元管理する。

## 9. React Native 側イベント処理

```text
Bridge → Store → MapLibre → UI
```

MapLibre は Store だけを参照する。

## 10. 非同期設計の基本方針

すべての通信は非同期とする。Engine 初期化・Route 生成で UI スレッドをブロックしない。

Bridge で重い処理を行わない。スレッド構成：`React Native UI Thread → Bridge → Coroutine → Position Engine → Sensor Thread`
