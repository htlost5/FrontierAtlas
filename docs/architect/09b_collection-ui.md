# 09b. Collection UI（収集 UI ― React Native）

## 1. 本節の目的

Collection UI は、Fingerprint 収集作業中のユーザインターフェースを React Native 側で提供する。地図上の Graph 表示、Node/Edge 選択、リアルタイム位置表示、補正操作、および全エラー表示を担当する。収集計算ロジックは一切持たず、Android Collection Engine の指示に従って表示を更新する。

## 2. 責務

| 担当 | 非担当 |
|-----|-------|
| MapLibre 上の Graph レイヤ表示 | 収集セッション管理（Kotlin 側） |
| Node/Edge のタップ選択 | PDR 計算・ドリフト検知（Kotlin 側） |
| 収集中のリアルタイム位置表示 | 特徴量抽出（Kotlin 側） |
| 補正操作 UI（位置再選択） | SQLite 保存（Kotlin 側） |
| 収集セッション制御 UI（開始・停止・中断・再開） | チェックポイント生成ロジック（Kotlin 側） |
| 全エラー種別の表示 | 経路補正計算（Kotlin 側） |
| ドリフト警告・補正促しの表示 | |

## 3. 画面構成

```text
┌──────────────────────────────────────────┐
│  Header Bar                              │
│  [←戻る]  収集モード  [ステータス表示]    │
├──────────────────────────────────────────┤
│                                          │
│                                          │
│          MapLibre 表示領域                │
│  ┌────────────────────────────────────┐ │
│  │  地物レイヤ（GeoJSON: 壁・部屋等）   │ │
│  │  Graph レイヤ（Node・Edge）         │ │
│  │  リアルタイム位置マーカー            │ │
│  │  チェックポイントマーカー            │ │
│  │  補正前軌跡（破線）                 │ │
│  └────────────────────────────────────┘ │
│                                          │
├──────────────────────────────────────────┤
│  Status Bar                              │
│  サンプル数: 42  |  距離: 38.5m  |  PDR良好│
├──────────────────────────────────────────┤
│  Control Bar                             │
│  [開始] [一時停止] [補正] [終了]          │
└──────────────────────────────────────────┘
```

### 3.1 画面状態遷移

```text
┌─────────────┐   startCollection()   ┌─────────────┐
│   Idle      │──────────────────────►│  Collecting │
│ （収集待機） │                       │ （収集中）    │
└─────────────┘                       └──────┬──────┘
       ▲                                     │
       │ stopCollection()         pauseCollection()
       │                                     ▼
       │                            ┌─────────────┐
       │                    ┌──────►│   Paused    │
       │                    │       │ （中断中）    │
       │                    │       └──────┬──────┘
       │                    │              │
       │                    │ resumeCollection()
       │                    └──────────────┘
       │
       │ stopCollection()（強制終了）
       │
┌──────┴──────┐
│  Completed  │
│ （収集完了） │
└─────────────┘
```

### 3.2 ステータス表示（Header Bar）

| 状態 | 表示内容 |
|------|---------|
| Idle | 「収集待機中」 |
| Collecting（PDR 正常） | 「収集中」+ 緑インジケータ |
| Collecting（PDR WARNING） | 「収集中（精度注意）」+ 黄インジケータ |
| Collecting（PDR CRITICAL） | 「補正を推奨」+ 赤インジケータ（点滅）+ 振動 |
| Paused | 「中断中」+ 灰インジケータ |
| Completed | 「収集完了」+ 青インジケータ |

## 4. Graph レイヤ表示

### 4.1 設計方針

Graph（Node/Edge）は、地物表示（GeoJSON の壁・部屋ポリゴン等）とは**独立した MapLibre レイヤ**として描画する。これにより、地物描画の再レンダリングに影響されず、Graph レイヤのスタイルを独立制御できる。

### 4.2 レイヤ構成

```text
MapLibre Style:
├── background
├── fill-layer: フロアポリゴン・部屋ポリゴン（地物）
├── line-layer: 壁・区画線（地物）
├── symbol-layer: POI アイコン（地物）
├── line-layer-graph-edges: Edge ライン（Graph レイヤ）     ← 新規
├── circle-layer-graph-nodes: Node ポイント（Graph レイヤ）   ← 新規
├── symbol-layer-collector-position: 収集者現在位置            ← 新規
├── symbol-layer-checkpoints: チェックポイント                 ← 新規
└── line-layer-collection-trajectory: 収集軌跡                 ← 新規
```

### 4.3 Graph レイヤのデータソース

Graph データは Map Assets の GPS 座標版（WGS84）GeoJSON から取得する。

```json
// Edge 用 GeoJSON (LineString)
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "id": "edge-001",
    "geometry": {
      "type": "LineString",
      "coordinates": [[139.7671, 35.6812], [139.7672, 35.6812]]
    },
    "properties": {
      "id": "edge-001",
      "fromNodeId": "node-A",
      "toNodeId": "node-B",
      "floorId": "F1",
      "length": 10.5
    }
  }]
}

// Node 用 GeoJSON (Point)
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "id": "node-A",
    "geometry": {
      "type": "Point",
      "coordinates": [139.7671, 35.6812]
    },
    "properties": {
      "id": "node-A",
      "floorId": "F1",
      "connectedEdges": ["edge-001", "edge-003"]
    }
  }]
}
```

### 4.4 スタイル定義

| 要素 | スタイル |
|------|---------|
| **Edge（未選択）** | 半透明青ライン、幅 3px、line-blur 0.5 |
| **Edge（選択中）** | 不透明シアンライン、幅 5px、line-blur 0 |
| **Node（未選択）** | 半透明青円、半径 6px |
| **Node（選択中）** | 不透明シアン円、半径 10px、外輪 2px 白 |
| **Edge 上選択位置** | 不透明シアン円、半径 8px、外輪 2px 白（Edge 上の補間位置に描画） |

## 5. Node/Edge 選択メカニズム

### 5.1 設計方針

> あらかじめアプリ側でNodeとEdgeを分離しないラインで描画されたUIを表示し、タップ時にそれがどの位置かを計算し一番近いedge, nodeとする（nodeに近い場合はnodeに寄せて良い）

- Node と Edge は視覚的に分離せず、連続したラインとして表示する
- ユーザのタップ座標から最も近い Graph 要素を計算
- Node から一定距離以内のタップは Node に吸着

### 5.2 タップ判定アルゴリズム

```text
入力: タップ座標（WGS84 緯度経度）
出力: GraphPosition（OnNode または OnEdge）

手順:
1. MapLibre の queryRenderedFeatures でタップ座標付近の全Featureを取得
2. GraphレイヤのFeatureに限定（source-layer フィルタ）
3. Node と Edge の候補に分類

4. 最近傍Nodeの検索:
   a. タップ座標から各Nodeの地理的距離を計算
   b. 最近傍Nodeの距離 d_node を取得
   c. 閾値: 画面ピクセル換算で 20px（約 2m〜5m、ズームレベル依存）
   d. d_node <= 閾値 → そのNodeを選択（OnNode）

5. Edge の検索（Nodeに該当しなかった場合）:
   a. 各Edge（LineString）に対して、タップ座標からEdge線分への垂線の足を計算
   b. 垂線の足がEdge区間内にあるEdgeのみを候補とする
   c. 垂線の足とタップ座標の距離 d_edge を取得
   d. 最小 d_edge のEdgeを選択
   e. Edge上のパラメータ t を計算:
      t = (垂線の足から fromNode までのEdge上距離) / Edge全長
   f. t が 0.05 未満 → fromNode に吸着（OnNode）
      t が 0.95 超過 → toNode に吸着（OnNode）
      それ以外 → OnEdge(edgeId, t, fromNodeId, toNodeId)

6. Node吸着の優先順位:
   - Edge 選択時も端点付近では Node に吸着させる
   - Node 吸着半径はズームレベルに応じて動的調整（ズームアウト時は大きめ）
```

### 5.3 吸着フィードバック

- タップ後、選択位置にアニメーション付きマーカーを表示（Node の場合は拡大 → 収束、Edge 上の点は出現 + パルス）
- 選択位置が Node に吸着された場合、短いバイブレーションでフィードバック

## 6. リアルタイム位置表示

### 6.1 収集者位置マーカー

```text
収集者の現在推定位置を表すマーカー（Symbol Layer）:
- 形状: 円 + 進行方向矢印
- 色: 
  - PDR Confidence HIGH（≥0.7）→ 緑
  - PDR Confidence MEDIUM（0.4〜0.7）→ 黄
  - PDR Confidence LOW（<0.4）→ 赤（点滅）
- サイズ: 半径 8px（ズームレベル非依存）
- 更新頻度: Bridge から PositionChanged イベント受信時（Throttle: 最小 200ms 間隔）
```

### 6.2 収集軌跡表示

```text
収集セッション開始からのPDR推定軌跡を LineLayer で表示:
- 線種: 実線（VALID 区間）/ 破線（DISCARDED 区間）
- 色: PDR Confidence に応じたグラデーション（緑 → 黄 → 赤）
  - 直近 N 点の PDR Confidence 平均に基づく
- 線幅: 2px
- 軌跡はセッション内の全ポイントを累積描画（過去軌跡は薄くフェード）
```

### 6.3 チェックポイントマーカー

```text
自動/手動チェックポイントの位置に小旗アイコン:
- 色: 
  - AUTO_NODE / AUTO_DISTANCE / AUTO_TIME → 青
  - MANUAL（ユーザ補正操作）→ オレンジ
  - AUTO_PAUSE（中断時）→ 灰
- サイズ: 半径 5px + 旗アイコン（高さ 12px）
- タップで詳細表示（チェックポイント番号、時刻、距離）
```

### 6.4 MapLibre Camera 制御

- **Follow Mode（デフォルト）**: 収集者位置を中心に自動追従。PDR Heading 方向を上にして回転
- **Free Mode**: ユーザが手動でパン/ズーム操作中は自動追従を一時停止
- Free Mode で 5 秒間操作がない場合、自動で Follow Mode に復帰
- 補正操作中は一時的に Free Mode に切り替え（ユーザが位置を選択しやすいよう）

## 7. 補正操作 UI

### 7.1 補正フロー

```text
【自動通知（ドリフト検知時）】
DriftWarningEvent 受信（level=CRITICAL）
  → Control Bar の [補正] ボタンが強調表示（オレンジ点滅）
  → Status Bar に「位置のズレを検出しました。現在地をタップしてください」表示
  → 15秒間ユーザが応答しない場合、非侵襲的な通知音 + バイブレーション

【手動補正（ユーザ任意）】
Control Bar の [補正] ボタンをタップ
  → Camera が Free Mode に切替
  → Status Bar に「マップ上の現在地をタップしてください」表示
  → Graph レイヤが選択可能状態に（タップ判定が有効化）
  → キャンセルボタン表示（補正操作中断用）

【位置選択】
ユーザが Graph 上の位置をタップ
  → 選択位置に仮マーカー表示（選択候補のプレビュー）
  → 確認ダイアログ: 「この位置に補正しますか？」[確認] [キャンセル]
  → 確認 → Bridge API: correctPosition(newPosition)
  → 補正中インジケータ表示（スピナー + 「補正中...」）

【補正完了】
CorrectionCompletedEvent 受信
  → 補正結果表示:
    - 比例配分補正時: 「経路を補正しました（XXm区間）」+ 軌跡がアニメーションで補正後位置に移動
    - 破棄時: 警告表示「直近XXmのデータは信頼性が低いため破棄されました」+ 破棄区間の軌跡が破線に変化
  → Camera が Follow Mode に復帰
  → [補正] ボタン通常表示に戻る
```

### 7.2 警告表示（破棄時）

```text
┌──────────────────────────────────────┐
│  ⚠️ データ破棄警告                    │
│                                      │
│  直近 12.3m（サンプル 18 件）の       │
│  データは信頼性が低いため破棄されました│
│                                      │
│  原因: PDR ドリフトが許容範囲を超過    │
│  アドバイス:                          │
│  ・こまめな位置補正を行ってください    │
│  ・直線区間では定期的な補正を推奨      │
│                                      │
│              [OK]                     │
└──────────────────────────────────────┘
```

## 8. 収集セッション制御 UI

### 8.1 Control Bar ボタン構成

| ボタン | 表示条件 | 動作 |
|--------|---------|------|
| **[開始]** | Idle 状態 | 位置選択モードに遷移 → 開始点選択 → 確認 → `startCollection()` |
| **[一時停止]** | Collecting 状態 | 確認ダイアログ → `pauseCollection()` |
| **[再開]** | Paused 状態 | 最終位置確認ダイアログ → `resumeCollection()` |
| **[補正]** | Collecting 状態 | 補正モードに遷移（§7 参照）。CRITICAL 時は強調表示 |
| **[終了]** | Collecting / Paused 状態 | 位置選択モードに遷移 → 終了点選択 → 確認 → `stopCollection()` |

### 8.2 開始フロー

```text
[開始] ボタンタップ
  → Status Bar: 「開始位置をタップしてください」
  → Graph レイヤ選択可能化
  → ユーザが Graph 上をタップ → 選択位置プレビュー表示
  → 確認ダイアログ: 「この位置から収集を開始しますか？」[開始] [キャンセル]
  → [開始] → startCollection() → Collecting 状態に遷移
```

### 8.3 終了フロー

```text
[終了] ボタンタップ
  → Status Bar: 「終了位置をタップしてください」
  → Graph レイヤ選択可能化
  → ユーザが Graph 上をタップ → 選択位置プレビュー表示
  → 確認ダイアログ:
    「収集を終了しますか？」
    サマリ: サンプル数 XX / 総距離 XXm / チェックポイント XX / 補正回数 XX
    [終了] [キャンセル]
  → [終了] → stopCollection() → Completed 状態に遷移
  → セッションサマリ表示 → [戻る] で前画面へ
```

### 8.4 中断・再開フロー

```text
【中断】
[一時停止] ボタンタップ
  → 確認ダイアログ: 「収集を中断しますか？再開時は最終チェックポイントから続行できます」
  → [中断] → pauseCollection() → Paused 状態

【再開】
[再開] ボタンタップ
  → 最終チェックポイント位置を地図上に表示
  → 確認ダイアログ:
    「現在地はこの位置と一致していますか？」
    地図上に最終チェックポイントをハイライト表示
    [はい、ここから再開] [いいえ、位置を指定する]
  → [はい] → resumeCollection()
  → [いいえ] → 位置選択モード → 選択 → resumeCollection(newPosition)
```

## 9. エラー表示設計

### 9.1 エラー種別と表示方式

| エラーコード | 深刻度 | 表示方式 | ユーザアクション |
|-------------|--------|---------|---------------|
| `ERR_WIFI_DISABLED` | CRITICAL | 全画面ダイアログ | WiFi 設定を開くボタン |
| `ERR_WIFI_SCAN_FAILED` | WARNING → CRITICAL | Status Bar 警告 → 全画面 | 警告: 継続監視 / CRITICAL: 収集中断 |
| `ERR_NO_MAGNETIC` | WARNING | Status Bar 常時表示 | 地磁気なしで継続するか確認 |
| `ERR_NO_PRESSURE` | INFO | Toast（5秒） | アクション不要 |
| `ERR_PDR_UNRELIABLE` | CRITICAL | 補正促しUI（§7）+ Status Bar 赤 | 補正操作を推奨 |
| `ERR_GPS_ACTIVE` | WARNING | Status Bar + Toast | 屋内であることの確認ダイアログ |
| `ERR_PERMISSION` | CRITICAL | 全画面ダイアログ | 設定アプリを開くボタン |
| `ERR_STORAGE` | CRITICAL | 全画面ダイアログ | ストレージ設定を開くボタン |
| `ERR_NO_GRAPH` | CRITICAL | 全画面ダイアログ | Map Assets 再ダウンロード |
| `ERR_TOO_MANY_CORRECTIONS` | WARNING | Status Bar 常時表示 | 環境確認を促すメッセージ |

### 9.2 エラー表示コンポーネント

```text
【全画面ダイアログ（CRITICAL エラー）】
┌──────────────────────────────────────┐
│                                      │
│           ⚠️ アイコン                 │
│                                      │
│        WiFi が無効です                │
│                                      │
│  Fingerprint収集にはWiFiが必要です。  │
│  WiFiを有効にしてから再開してください。│
│                                      │
│     [設定を開く]    [キャンセル]       │
│                                      │
└──────────────────────────────────────┘

【Status Bar 警告（WARNING）】
┌──────────────────────────────────────────┐
│ ⚠️ WiFiスキャンに失敗しています  [詳細]   │
│  サンプル数: 42  |  距離: 38.5m           │
└──────────────────────────────────────────┘

【Toast（INFO）】
画面上部からスライドイン → 3〜5秒後自動消滅
「気圧センサーが利用できません。気圧データは収集されません。」
```

### 9.3 エラー回復フロー

```text
エラー発生 → CollectionEventEngine → Bridge → React Native
  → ErrorHandler（エラー種別に応じた表示コンポーネントを選択）
  → ユーザアクション or 自動回復

【自動回復が可能なエラー】
- ERR_WIFI_SCAN_FAILED: 連続失敗が N 回未満なら自動再試行
- ERR_GPS_ACTIVE: 屋内推定が一定時間継続すれば自動解除

【ユーザアクションが必要なエラー】
- 全画面ダイアログでアクション完了後、エンジンに再試行を通知
```

## 10. コンポーネントツリー

```text
CollectionScreen
├── CollectionHeader
│   ├── BackButton
│   ├── TitleText（「収集モード」）
│   └── StatusIndicator（円形インジケータ + 状態テキスト）
│
├── MapView（MapLibre GL MapView）
│   ├── GeoJSONLayers（地物: 壁・部屋・POI）
│   ├── GraphEdgeLayer（Edge LineString）
│   ├── GraphNodeLayer（Node Point）
│   ├── CollectorPositionLayer（収集者位置マーカー）
│   ├── CheckpointLayer（チェックポイントマーカー）
│   └── TrajectoryLayer（収集軌跡ライン）
│
├── CollectionStatusBar
│   ├── SampleCountText
│   ├── DistanceText
│   ├── PdrStatusIndicator
│   └── WarningMessage（条件表示）
│
├── CollectionControlBar
│   ├── StartButton（Idle時）
│   ├── PauseButton（Collecting時）
│   ├── ResumeButton（Paused時）
│   ├── CorrectButton（Collecting時、CRITICAL時強調）
│   └── StopButton（Collecting/Paused時）
│
├── PositionSelectionOverlay（条件表示）
│   ├── PromptText（「位置をタップしてください」）
│   └── CancelButton
│
├── ConfirmDialog（条件表示）
│   ├── MessageText
│   ├── ConfirmButton
│   └── CancelButton
│
├── CorrectionResultOverlay（条件表示）
│   ├── ResultIcon
│   ├── ResultMessage
│   └── OkButton
│
├── ErrorFullScreenDialog（条件表示）
│   ├── ErrorIcon
│   ├── ErrorTitle
│   ├── ErrorMessage
│   ├── ActionButton
│   └── DismissButton
│
└── ToastNotification（条件表示）
    └── MessageText
```

## 11. 状態管理（ViewModel）

```typescript
// CollectionViewModel（React Native 側の状態）
interface CollectionState {
  // セッション状態
  sessionStatus: 'IDLE' | 'COLLECTING' | 'PAUSED' | 'COMPLETED';
  sessionId: string | null;
  buildingId: string | null;
  floorId: string | null;

  // 収集統計
  sampleCount: number;
  totalDistance: number;
  checkpointCount: number;
  correctionCount: number;

  // PDR 状態
  pdrConfidence: number;           // 0.0〜1.0
  pdrConfidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  driftWarningLevel: 'NONE' | 'WARNING' | 'CRITICAL';

  // 位置情報
  currentGraphPosition: GraphPosition | null;
  currentLocalPosition: { x: number; y: number } | null;
  currentHeading: number | null;

  // UI 状態
  isSelectingPosition: boolean;    // 位置選択モードか
  selectionPurpose: 'START' | 'CORRECT' | 'END' | null;
  isConfirmDialogVisible: boolean;
  isCorrectionResultVisible: boolean;
  correctionResult: CorrectionResult | null;

  // エラー
  activeErrors: CollectionError[];
  fullScreenError: CollectionError | null;

  // 軌跡データ
  trajectoryPoints: TrajectoryPoint[];
  checkpoints: CheckpointMarker[];
  discardedSegments: DiscardedSegment[];

  // MapLibre
  cameraMode: 'FOLLOW' | 'FREE';
  selectedGraphPosition: GraphPosition | null; // プレビュー表示用
}

interface CorrectionResult {
  strategy: 'RUBBER_BAND' | 'DISCARD';
  correctedSampleCount: number;
  discardedSampleCount: number;
  discardedDistance: number;
}
```

## 12. Bridge API インターフェース（React Native 側）

```typescript
// CollectionBridge — React Native → Kotlin 命令
interface CollectionBridge {
  startCollection(config: CollectionConfig): Promise<void>;
  pauseCollection(): Promise<void>;
  resumeCollection(confirmedPosition?: GraphPosition): Promise<void>;
  correctPosition(newPosition: GraphPosition): Promise<void>;
  stopCollection(endPosition: GraphPosition): Promise<void>;
}

interface CollectionConfig {
  buildingId: string;
  floorId: string;
  startPosition: GraphPosition;
  deviceInfo: {
    model: string;
    manufacturer: string;
    androidVersion: string;
  };
}

// CollectionEventEmitter — Kotlin → React Native イベント
interface CollectionEvents {
  onSessionStarted(event: { sessionId: string }): void;
  onSessionPaused(): void;
  onSessionResumed(): void;
  onSessionCompleted(event: SessionSummary): void;
  onCheckpointGenerated(event: CheckpointEvent): void;
  onDriftWarning(event: { level: 'WARNING' | 'CRITICAL'; score: number }): void;
  onCorrectionCompleted(event: CorrectionResult): void;
  onPositionUpdated(event: PositionUpdate): void;
  onErrorOccurred(event: CollectionErrorEvent): void;
}

interface PositionUpdate {
  graphPosition: GraphPosition;
  localPosition: { x: number; y: number };
  heading: number;
  pdrConfidence: number;
  sampleCount: number;
  totalDistance: number;
}

interface CollectionErrorEvent {
  code: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  recoverable: boolean;
}
```
