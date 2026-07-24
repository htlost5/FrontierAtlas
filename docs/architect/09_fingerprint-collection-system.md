# 09. Fingerprint Collection System（Fingerprint 収集システム）

## 1. 本節の目的

Fingerprint Collection System は、既存の「Fingerprint 照合による位置推定」（測位モード）に対して、**Fingerprint DB を構築するためのデータ収集**（収集モード）を実現するシステムである。

既存アーキテクチャ（`06c_fingerprint-engine.md`）では、あらかじめ構築された Fingerprint DB との照合による位置推定のみが設計されており、**Fingerprint DB をどのように構築するか**は未設計であった。本節およびサブドキュメントでこの収集側の設計を完了させる。

## 2. モード分離設計：収集モードと測位モード

Position Engine は以下の 2 モードで動作する。両モードは排他であり、同時には動作しない。

```text
┌─────────────────────────────────────────────────────────────┐
│                    Position Engine                          │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────┐│
│  │   Positioning Mode   │    │    Collection Mode          ││
│  │   （測位モード）       │    │    （収集モード）             ││
│  │                      │    │                             ││
│  │  Sensor → PDR        │    │  Sensor → Feature Extraction││
│  │       → Fingerprint  │    │  User Position (Ground Truth)││
│  │       → Fusion       │    │       → Sample Recording    ││
│  │       → Map Matching │    │       → PDR Tracking        ││
│  │       → Event        │    │       → SQLite Storage      ││
│  └─────────────────────┘    └─────────────────────────────┘│
│          ↑        ↑                ↑         ↑             │
│    共通 Sensor Layer       共通 Sensor Layer               │
│    共通 Infrastructure     共通 Infrastructure             │
└─────────────────────────────────────────────────────────────┘
```

### 2.1 測位モード（既存設計、`04` 系ドキュメント参照）

- **目的**: センサーデータから現在位置を推定する
- **入力**: Sensor Data + Fingerprint DB + Navigation Graph
- **出力**: `MatchedPosition`（推定位置、Event Engine 経由で React Native へ通知）
- **データの流れ**: `Sensor → PDR / Fingerprint → Fusion → Map Matching → Event`

### 2.2 収集モード（本節で新規設計）

- **目的**: 既知の位置（ユーザ指定の Ground Truth）におけるセンサー特徴量を収集し、Fingerprint DB の素材を生成する
- **入力**: Sensor Data + User-specified Graph Position (Ground Truth) + Navigation Graph
- **出力**: Raw Collection Samples（SQLite に格納、後に Fingerprint DB へ変換）
- **データの流れ**: `Sensor → Feature Extraction + User Position → Sample Recording → SQLite`

### 2.3 モード比較

| 観点 | 測位モード（Positioning） | 収集モード（Collection） |
|------|--------------------------|--------------------------|
| 位置の決定者 | Engine（推定） | User（Ground Truth） |
| Fingerprint DB | 入力（読み取り専用） | 出力（収集データから後工程で生成） |
| PDR の役割 | 相対移動の主推定源 | 収集歩行の補助トラッキング |
| Map Matching | 推定位置を建物構造へ補正 | ユーザ指定位置のグラフ位置妥当性検証 |
| 出力先 | Event Engine → Bridge → React Native | SQLite（Raw Samples） |
| セッション概念 | なし（連続運用） | あり（開始〜終了の明示的区間） |

## 3. システム全体アーキテクチャ（収集モード）

```text
┌──────────────────────────────────────────────────────────────┐
│                   React Native（Collection UI）               │
│  Graph Layer表示 / Node・Edge選択 / リアルタイム位置表示       │
│  収集セッション制御 / エラー表示                               │
└──────────────────────────────────────────────────────────────┘
                              │ Bridge API（命令 + Event受信）
                              ▼
┌──────────────────────────────────────────────────────────────┐
│              Android Position Engine（Collection Mode）       │
│                                                              │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Sensor  │  │  Collection  │  │  Collection           │  │
│  │  Layer   │→│  Engine       │→│  Recorder             │  │
│  │（共通）   │  │  (PDR+補正)  │  │  (Sample生成+SQLite) │  │
│  └──────────┘  └──────────────┘  └───────────────────────┘  │
│                                                              │
│  Collection Control Layer（新規）                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ CollectionSessionManager / CheckpointManager         │   │
│  │ DriftDetector / PathCorrector / CollectionEventEngine│   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│              SQLite（Collection Raw Database）                │
│  sessions / samples / checkpoints / wifi_scans /             │
│  magnetic_samples / pressure_samples                         │
└──────────────────────────────────────────────────────────────┘
```

### 3.1 新規コンポーネント一覧

| コンポーネント | 所属 | 責務 |
|--------------|------|------|
| **CollectionSessionManager** | Android Native | 収集セッションのライフサイクル管理（開始・一時停止・再開・終了） |
| **CheckpointManager** | Android Native | 自動チェックポイント生成・管理 |
| **DriftDetector** | Android Native | PDR ドリフト検知・ユーザへの補正通知判定 |
| **PathCorrector** | Android Native | 補正操作時の経路遡及補正（比例配分／破棄判定） |
| **CollectionRecorder** | Android Native | センサー特徴量と位置の紐付け・Sample 生成・SQLite 書込 |
| **CollectionEventEngine** | Android Native | 収集モード専用イベント（ドリフト警告・チェックポイント生成・エラー）の発火 |
| **GraphLayer（React Native）** | React Native | MapLibre 上に Node/Edge を独立レイヤで描画・選択インタラクション |
| **CollectionViewModel（React Native）** | React Native | 収集セッション状態管理・UI 制御 |

### 3.2 既存コンポーネントの再利用

| 既存コンポーネント | 収集モードでの利用 | 変更の要否 |
|------------------|------------------|-----------|
| **Sensor Layer** | 変更なし（WiFi・地磁気・気圧・加速度・ジャイロをそのまま利用） | 不要 |
| **StepDetector**（PDR） | 歩行検出・歩数推定を再利用 | 不要 |
| **StrideEstimator**（PDR） | 歩幅推定を再利用 | 不要 |
| **HeadingEstimator**（PDR） | 進行方向推定を再利用 | 不要 |
| **RelativePositionCalculator**（PDR） | 相対移動量計算を再利用 | 不要 |
| **Infrastructure Layer** | SensorManager・WifiManager 等を再利用 | 不要 |
| **Position Controller** | モード切替機能を追加 | **要変更** |

## 4. データフロー（収集モード）

```text
【開始フロー】
User（Graph 上の開始点選択）
  → Bridge API: startCollection(sessionConfig, startPosition)
  → CollectionSessionManager: セッション作成・SQLite 記録
  → Sensor Layer: センサー取得開始
  → PDR Engine: 歩行追跡開始（初期位置 = ユーザ指定位置）
  → CollectionRecorder: 初回 Sample 記録
  → CollectionEventEngine: セッション開始イベント → React Native

【歩行中フロー】
Sensor Layer → 加速度/ジャイロ/地磁気/WiFi/気圧
  ├→ PDR Engine → 相対移動量 → CollectionSessionManager（位置更新）
  ├→ CollectionRecorder → Feature Extraction → Sample 生成
  └→ DriftDetector → ドリフト判定
        ├→ 正常: 継続
        └→ ドリフト検知 → CollectionEventEngine → React Native（補正促し通知）

【補正フロー】
User（Graph 上の補正位置選択）
  → Bridge API: correctPosition(newPosition)
  → PathCorrector: 直前チェックポイントからの経路評価
        ├→ 信頼可能: 比例配分で遡及補正（Rubber-band correction）
        └→ 信頼不能: 該当区間の Sample を破棄マーク + ユーザ警告
  → CollectionRecorder: 補正後位置で Sample 再開
  → CollectionEventEngine: 補正完了イベント → React Native

【終了フロー】
User（Graph 上の終了点選択）
  → Bridge API: stopCollection(endPosition)
  → CollectionSessionManager: セッション終了・集計・SQLite 最終書込
  → Sensor Layer: センサー取得停止
  → CollectionEventEngine: セッション終了イベント → React Native
```

## 5. サブドキュメント構成

| ドキュメント | 内容 |
|-------------|------|
| `09a_collection-engine.md` | Android Native 収集エンジン（データモデル、PDR トラッキング、補正ロジック、チェックポイント、WiFi 密度、端末較正、セッション管理、SQLite スキーマ） |
| `09b_collection-ui.md` | React Native 収集 UI（Graph レイヤ表示、Node/Edge 選択、リアルタイム位置表示、補正操作 UI、エラー表示設計） |
| `09c_fingerprint-db-pipeline.md` | 収集データ → Fingerprint DB 変換パイプライン（集約・補間・外れ値除去・正規化・DB フォーマット・Map Assets Pipeline 統合） |

## 6. 既存アーキテクチャとの関係

### 6.1 コンポーネント間関係図

```text
                         ┌──────────────────┐
                         │  Map Assets       │
                         │  Pipeline         │
                         │  (tools/)         │
                         └──────┬───────────┘
                                │ Node/Edge Graph 提供
         ┌──────────────────────┼──────────────────────┐
         ▼                      ▼                      ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────────┐
│  React Native   │   │  Position Engine│   │  Fingerprint DB      │
│  Collection UI  │◄─►│  Collection Mode│──►│  Pipeline（新規）     │
│  (09b)          │   │  (09a)          │   │  (09c)               │
└─────────────────┘   └─────────────────┘   └──────────┬──────────┘
         │                      │                      │
         │                      ▼                      │
         │             ┌─────────────────┐             │
         │             │  SQLite         │             │
         │             │  Raw Samples    │─────────────┘
         │             └─────────────────┘  変換パイプライン入力
         │
         ▼
┌─────────────────┐
│  MapLibre       │
│  (Graph Layer)  │
└─────────────────┘
```

### 6.2 技術スタック整合性

| 項目 | 既存設計（`04_technology-stack.md`） | 収集システムでの対応 |
|------|-------------------------------------|---------------------|
| Kotlin（位置エンジン） | 既存 | Collection Engine を同梱 |
| React Native + TypeScript | 既存 | Collection UI を同梱 |
| SQLite | 新規 | Raw Samples 保存 |
| MapLibre | 既存 | Graph Layer 追加 |
| Map Assets Pipeline | 既存 | Fingerprint DB Pipeline 追加 |

### 6.3 設計原則遵守

| 設計原則（`02_design-principles.md`） | 収集システムでの対応 |
|--------------------------------------|---------------------|
| 単一責務 | 収集・保存・変換を分離 |
| 疎結合 | Collection Engine ↔ Collection UI は Bridge API のみで結合 |
| UI とロジックの分離 | 収集計算はすべて Kotlin 側、UI は React Native 側 |
| ネイティブ処理の原則 | センサー・PDR・SQLite はすべて Kotlin 側 |
| イベント駆動 | 収集状態変化はイベントで通知（ポーリング禁止） |
| データ駆動 | 収集対象の建物情報は Map Assets から取得 |
