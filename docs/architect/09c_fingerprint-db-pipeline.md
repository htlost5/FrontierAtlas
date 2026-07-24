# 09c. Fingerprint DB Pipeline（収集データ → Fingerprint DB 変換パイプライン）

## 1. 本節の目的

Fingerprint DB Pipeline は、Collection Engine が SQLite に保存した Raw Sample 群を、Positioning Mode の Fingerprint Engine（`06c_fingerprint-engine.md`）が照合に利用する **Fingerprint DB** へ変換するパイプラインである。

変換は Android 端末上または外部ツール（`tools/map-assets/builder/`）で実行され、最終的な Fingerprint DB は Map Assets の一部として配布される。

## 2. パイプラインの位置付け

```text
【データの流れ】
Collection Engine（Android Native）
  → SQLite（Raw Samples）
    → [エクスポート] Raw JSON / SQLite dump
      → Fingerprint DB Pipeline（本節）
        → Fingerprint DB（バイナリ / JSON）
          → Map Assets Pipeline（`tools/map-assets/builder/`）
            → Release パッケージ
              → Cloudflare R2 配布
                → Positioning Mode がダウンロード
```

## 3. 責務

| 担当 | 非担当 |
|-----|-------|
| Raw Sample の集約（複数パス・複数セッション） | 収集セッション管理（09a） |
| 空間補間（非サンプリング区間の推定） | センサー取得（04a） |
| 外れ値除去・ノイズフィルタリング | 経路補正（09a） |
| 特徴量の正規化・Fingerprint ベクトル生成 | UI（09b） |
| Fingerprint DB フォーマットの生成 | 照合アルゴリズム（04c） |
| Map Assets Pipeline との統合 | 配布（Cloudflare R2） |

## 4. パイプラインステージ

```text
┌─────────────────┐
│ Stage 1: Export │  Raw Samples を SQLite からエクスポート
└────────┬────────┘
         ▼
┌─────────────────┐
│ Stage 2: Merge  │  複数セッション・複数パスのデータを統合
└────────┬────────┘
         ▼
┌─────────────────┐
│ Stage 3: Clean  │  外れ値除去・品質フィルタリング
└────────┬────────┘
         ▼
┌─────────────────┐
│ Stage 4: Interp │  空間補間（非サンプリング区間の補充）
└────────┬────────┘
         ▼
┌─────────────────┐
│ Stage 5: Norm   │  特徴量正規化・Fingerprint ベクトル生成
└────────┬────────┘
         ▼
┌─────────────────┐
│ Stage 6: Build  │  Fingerprint DB ファイル生成
└────────┬────────┘
         ▼
┌─────────────────┐
│ Stage 7: Pack   │  Map Assets Pipeline に統合・Release 生成
└─────────────────┘
```

## 5. Stage 1: Export（エクスポート）

### 5.1 エクスポート形式

SQLite からエクスポートするデータ形式。Android 端末から抽出し、外部ツールに渡す中間フォーマット。

```json
{
  "version": "1.0",
  "exportedAt": "2026-07-24T10:30:00Z",
  "sourceDevice": {
    "model": "Pixel 8",
    "manufacturer": "Google",
    "calibrationProfileId": "calib-001"
  },
  "buildingId": "bldg-A",
  "floorId": "F1",
  "sessions": [
    {
      "sessionId": "sess-001",
      "startTime": 1721808000000,
      "endTime": 1721808300000,
      "totalDistance": 120.5,
      "sampleCount": 110,
      "checkpoints": [
        {
          "checkpointId": "cp-001",
          "sequenceNumber": 1,
          "timestamp": 1721808000000,
          "graphPosition": {
            "type": "NODE",
            "nodeId": "node-A"
          },
          "generationType": "MANUAL"
        }
      ],
      "samples": [
        {
          "sampleId": "spl-001",
          "sequenceNumber": 1,
          "timestamp": 1721808001000,
          "graphPosition": {
            "type": "EDGE",
            "edgeId": "edge-001",
            "t": 0.05,
            "fromNodeId": "node-A",
            "toNodeId": "node-B"
          },
          "localPosition": { "x": 10.5, "y": 20.3, "floorId": "F1" },
          "status": "VALID",
          "wifi": {
            "scanTimestamp": 1721808001000,
            "scanDurationMs": 1200,
            "aps": [
              {
                "bssid": "00:11:22:33:44:55",
                "rssiRaw": -45,
                "rssiNormalized": 0.72,
                "frequency": 2412,
                "isCalibrated": true
              }
            ]
          },
          "magnetic": {
            "rawVector": [15.2, -8.1, 42.3],
            "normalizedVector": [0.33, -0.18, 0.93],
            "magnitude": 45.8,
            "horizontalIntensity": 17.2,
            "verticalIntensity": 42.3,
            "anomalyScore": 0.15,
            "stability": 0.92,
            "sampleWindowMs": 1000
          },
          "pressure": {
            "pressureHpa": 1013.2,
            "relativePressure": 0.0,
            "pressureTrend": 0.01,
            "confidence": 0.95
          }
        }
      ],
      "discardedSegments": []
    }
  ]
}
```

### 5.2 エクスポート方式

- **開発・検証時**: Android Debug Bridge（adb）で SQLite ファイルを pull し、外部スクリプトで JSON 変換
- **本番運用時**: アプリ内から Export 機能で JSON を生成 → ファイル共有または Cloudflare R2 にアップロード
- 変換ツールは `tools/map-assets/builder/` に配置（Python または Kotlin スクリプト）

## 6. Stage 2: Merge（統合）

### 6.1 統合対象

- 同一建物・同一フロアの**複数収集セッション**
- 同一経路の**複数回通行**（往復・繰り返し）
- **異なる端末**で収集されたデータ（較正プロファイルを考慮）
- **異なる日時**に収集されたデータ（時間経過による環境変化の評価用）

### 6.2 統合戦略

```text
【空間グリッド統合】
1. フロアのローカル座標系に一定間隔のグリッドを設定（例: 1.0m × 1.0m）
2. Graph Edge 上については、Edge に沿った 1.0m 間隔のサンプリングポイントを設定
3. 各グリッドセル / Edge サンプリングポイントに、半径 R 以内の全 Sample を集約
   R = 1.5m（グリッドセルの対角線の半分 + 余裕）

【集約演算（WiFi）】
- 同一 BSSID の RSSI:
  - median(RSSI) を代表値とする（平均より外れ値に強い）
  - 観測回数が閾値（3回）未満の BSSID は除外（一時的なAPを除去）
  - 標準偏差 > 8 dBm の BSSID は「不安定AP」としてマーク（Confidence 低下要因）

【集約演算（地磁気）】
- ベクトル成分ごとに中央値
- anomalyScore の中央値
- サンプル数が少ないセルは Confidence を下げる（目安: 3サンプル未満 → Confidence ×0.5）

【集約演算（気圧）】
- relativePressure の中央値
- 気圧は空間より時間変動の影響が大きいため、セッション間の基準気圧を揃える補正を適用
```

### 6.3 複数端末データの統合

```text
較正プロファイルが存在する端末のデータ:
  - 各端末の RSSI に較正オフセットを適用してから集約
  - 較正プロファイルがない端末のデータは、リファレンス端末のデータと
    同一BSSIDのRSSI差分から簡易オフセットを推定（事後較正）
  - 事後較正できない端末のデータは信頼度を下げる
```

## 7. Stage 3: Clean（クリーニング）

### 7.1 外れ値検出

```text
【WiFi RSSI の外れ値】
- 同一セル・同一BSSID の RSSI 群に対して:
  1. 四分位範囲（IQR）を計算
  2. Q1 - 1.5×IQR 未満 または Q3 + 1.5×IQR 超過 → 外れ値
  3. 外れ値は除外（当該BSSIDの当該セルからのみ除去）

【地磁気の外れ値】
- 磁場ベクトルの大きさ |B| が:
  - 地球磁場の一般的範囲（25〜65 μT）を外れる → 外れ値（金属至近距離の可能性）
  - 同一セル内で他サンプルと比較し、コサイン類似度 < 0.7 → 外れ値

【位置の外れ値】
- PDR 推定位置が Edge から 3m 以上離れている → 位置精度が疑わしい
  → 当該 Sample の全センサーデータを除外（DISCARDED マーク）
```

### 7.2 品質フィルタ

| フィルタ条件 | 閾値 | アクション |
|-------------|------|-----------|
| WiFi AP 数不足 | 観測 AP < 3 | Sample の WiFi 特徴量を null 扱い（地磁気のみで評価） |
| 地磁気安定性不足 | stability < 0.3 | Sample の地磁気特徴量を null 扱い（WiFi のみで評価） |
| 気圧変動過大 | pressureTrend > 0.5 hPa/min | エレベータ移動の可能性 → Sample の気圧特徴量を null 扱い |
| 収集経過日数 | 90日超 | データ鮮度フラグを低下（Confidence 評価に影響） |

## 8. Stage 4: Interp（空間補間）

### 8.1 補間の必要性

収集歩行中にすべての Edge 上の全点でサンプリングできるわけではない。特に：
- WiFi スキャン間隔（1〜4秒）の間に 1〜5.6m 移動するため、全点で WiFi データが得られるとは限らない
- 地磁気は高頻度だが、空間的なカバレッジの偏りがあり得る

### 8.2 補間対象

| センサー | 補間方法 | 備考 |
|---------|---------|------|
| **WiFi** | Edge 上の隣接サンプリングポイント間で BSSID セットを共有する場合のみ線形補間 | BSSID セットが異なる場合は補間不可（AP の出現/消失は連続的でないため、無理な補間は行わない） |
| **地磁気** | Edge 上の隣接サンプリングポイント間で線形補間（ベクトル各成分） | 磁場は空間的に連続なため補間可能 |
| **気圧** | Edge 上の隣接サンプリングポイント間で線形補間 | 同一フロアでは気圧はほぼ一定のため、補間の必要性は低い |

### 8.3 補間ルール

```text
1. 補間は同一 Edge 内、かつ同一収集セッション内に限定する
   （異なるセッション間の補間は信頼性が低いため禁止）

2. WiFi 補間の追加条件:
   - 隣接する 2 つの実測 Sample の BSSID セットの Jaccard 類似度 ≥ 0.7
   - 条件を満たさない場合、補間点の WiFi 特徴量は null
   - 補間点の status → INTERPOLATED

3. 空間解像度:
   - 補間点の間隔は 1.0m
   - 実測点が 1.0m 以内に存在する場合、その区間は補間不要

4. 補間後のデータには INTERPOLATED マークを付与し、
   Fingerprint DB 上でも補間点であることを記録（Confidence 評価で参照）
```

## 9. Stage 5: Norm（正規化・ベクトル生成）

### 9.1 正規化の目的

収集した特徴量を、Positioning Mode の Fingerprint Engine（`04c`）が照合可能な Fingerprint ベクトル形式に変換する。

### 9.2 Fingerprint DB のデータモデル

```kotlin
// Fingerprint DB の 1 エントリ（照合用）
data class FingerprintEntry(
    val entryId: String,            // 一意識別子
    val buildingId: String,
    val floorId: String,
    val graphPosition: GraphPosition,
    val localPosition: LocalPosition,

    // WiFi Fingerprint
    val wifiFingerprint: WifiFingerprint?,

    // 地磁気 Fingerprint
    val magneticFingerprint: MagneticFingerprint?,

    // 気圧 Fingerprint
    val pressureFingerprint: PressureFingerprint?,

    // メタデータ
    val collectionMetadata: CollectionMetadata
)

data class WifiFingerprint(
    val apSignatures: List<ApSignature>,
    val qualityScore: Float           // 0.0〜1.0（AP数・安定性・較正状態に基づく）
)

data class ApSignature(
    val bssid: String,
    val meanRssiNormalized: Float,    // 正規化RSSIの代表値（中央値）
    val rssiStdDev: Float,            // RSSIの標準偏差（環境の変動性を示す）
    val observationCount: Int,        // 観測回数（少ないほど信頼度低）
    val detectionRate: Float,         // 検出率（0.0〜1.0、全通過時の観測割合）
    val isInterpolated: Boolean       // 補間値か
)

data class MagneticFingerprint(
    val meanVector: Triple<Float, Float, Float>,  // 平均磁場ベクトル（正規化済）
    val vectorStdDev: Float,                      // ベクトル変動の標準偏差
    val anomalyScore: Float,                      // 異常度（0.0〜1.0）
    val qualityScore: Float                       // 0.0〜1.0
)

data class PressureFingerprint(
    val relativePressure: Float,       // 基準気圧からの相対値
    val pressureStdDev: Float,         // 気圧変動の標準偏差
    val qualityScore: Float            // 0.0〜1.0
)

data class CollectionMetadata(
    val collectedAt: Long,             // 収集日時（epoch ms）
    val sessionCount: Int,             // 統合セッション数
    val totalSampleCount: Int,         // 統合サンプル数
    val deviceCount: Int,              // 収集端末数
    val isInterpolated: Boolean,       // 空間補間点か
    val lastUpdatedAt: Long            // 最終更新日時
)
```

### 9.3 WiFi Fingerprint の正規化戦略

```text
【絶対 RSSI ベース（デフォルト）】
- 較正済み正規化 RSSI をそのまま利用
- 利点: シンプル、計算コスト低
- 欠点: 端末差の影響を完全には除去できない

【差分 RSSI ベース（オプション、端末差対策）】
- 同一スキャン内の全 AP の RSSI を平均し、各 AP の RSSI との差分を特徴量とする
- rssiDiff[bssid] = rssiNormalized[bssid] - mean(rssiNormalized of all APs in scan)
- 利点: 端末の系統的オフセットを相殺できる
- 欠点: AP 数が少ないと特徴量の情報量が低下

【選択ルール】
- AP 数 >= 5 の環境 → 差分 RSSI ベース（端末差耐性を優先）
- AP 数 < 5 の環境 → 絶対 RSSI ベース（情報量を優先）
- 切り替えは建物・フロア単位で設定可能
```

### 9.4 地磁気 Fingerprint の正規化

```text
- 生ベクトルを大きさ 1.0 に正規化（方向情報のみを保持）
- 水平成分・鉛直成分に分解し、それぞれを特徴量として保持
- anomalyScore は広域ベースラインとの差分 → 局所的な磁気異常を示す
- 地磁気マップ全体での anomalyScore の分布から、有意な異常点を Fingerprint として採用
  （anomalyScore < 0.2 の地点は「特徴のない地点」として Confidence を下げる）
```

## 10. Stage 6: Build（Fingerprint DB 構築）

### 10.1 DB フォーマット

Fingerprint DB は建物・フロア単位でファイル化し、Map Assets に同梱する。

```text
fingerprint/
├── bldg-A/
│   ├── F1/
│   │   ├── wifi_fingerprint.json      ← WiFi Fingerprint
│   │   ├── magnetic_fingerprint.json  ← 地磁気 Fingerprint
│   │   └── pressure_fingerprint.json  ← 気圧 Fingerprint
│   ├── F2/
│   │   └── ...
│   └── metadata.json                  ← 建物メタデータ（バージョン・更新日時・収集端末一覧）
└── bldg-B/
    └── ...
```

### 10.2 ファイルフォーマット詳細

```json
// wifi_fingerprint.json
{
  "formatVersion": "1.0",
  "buildingId": "bldg-A",
  "floorId": "F1",
  "generatedAt": "2026-07-24T12:00:00Z",
  "entries": [
    {
      "entryId": "fp-001",
      "graphPosition": {
        "type": "EDGE",
        "edgeId": "edge-001",
        "t": 0.05,
        "fromNodeId": "node-A",
        "toNodeId": "node-B"
      },
      "localPosition": { "x": 10.5, "y": 20.3 },
      "apSignatures": [
        {
          "bssid": "00:11:22:33:44:55",
          "meanRssiNormalized": 0.72,
          "rssiStdDev": 2.1,
          "observationCount": 12,
          "detectionRate": 1.0,
          "isInterpolated": false
        }
      ],
      "qualityScore": 0.85,
      "isInterpolated": false,
      "sessionCount": 3,
      "totalSampleCount": 15
    }
  ],
  "globalStats": {
    "totalEntries": 120,
    "interpolatedEntryCount": 18,
    "averageApCount": 8.3,
    "collectionDateRange": { "from": "2026-07-20", "to": "2026-07-24" }
  }
}
```

### 10.3 空間インデックス

Fingerprint Engine（`04c`）の照合効率化のため、Fingerprint DB には空間インデックスを付与する。

```text
- 各 Entry に属する Edge ID をキーとする索引
- 各 Entry のローカル座標を 5m × 5m グリッドで区分し、グリッド ID → Entry リストの索引
- 索引は Fingerprint DB ファイル内に埋め込み、Positioning Mode 起動時にメモリ展開
```

## 11. Stage 7: Pack（Map Assets Pipeline 統合）

### 11.1 統合フロー

```text
fingerprint/ 配下の Fingerprint DB ファイル群
        │
        ▼
tools/map-assets/builder/
  ├── validate_fingerprint.py   ← Fingerprint DB のバリデーション
  │   - フォーマットチェック
  │   - Graph (Node/Edge) との整合性チェック（存在しないEdgeを参照していないか）
  │   - 必須項目の欠落チェック
  │   - WiFi BSSID 形式チェック
  │   - 地磁気ベクトル範囲チェック
  │   - 統計レポート出力
  │
  ├── pack_fingerprint.py       ← Fingerprint DB のパッケージング
  │   - JSON → バイナリフォーマット変換（オプション、容量削減用）
  │   - 圧縮（gzip）
  │   - バージョン管理（GitHub Releases のタグと同期）
  │
  └── release_builder.py        ← Release パッケージ生成（既存の拡張）
      - Fingerprint DB を Release ZIP に同梱
      - Manifest に Fingerprint DB のバージョン情報を追加
```

### 11.2 既存 Map Assets Pipeline への変更点

`05_project-structure.md` §3 の `tools/map-assets/` 構造に以下を追加：

```text
tools/map-assets/
  builder/
    fingerprint/              ← 新規追加
      validate_fingerprint.py ← Fingerprint DB バリデーション
      pack_fingerprint.py     ← Fingerprint DB パッケージング
      merge_sessions.py       ← Stage 2 Merge の実装
      clean_samples.py        ← Stage 3 Clean の実装
      interpolate.py          ← Stage 4 Interp の実装
      normalize.py            ← Stage 5 Norm の実装
      build_db.py             ← Stage 6 Build の実装
      pipeline.py             ← パイプライン全体のオーケストレーション
    build/
      fingerprint/            ← 変換後 Fingerprint DB の出力先
        bldg-A/F1/wifi_fingerprint.json ...
```

### 11.3 Manifest 拡張

Map Assets の Manifest（`releases/manifest.json`）に Fingerprint DB のメタデータを追加：

```json
{
  "buildingId": "bldg-A",
  "version": "1.2.0",
  "assets": {
    "geojson": { "version": "1.2.0", "url": "..." },
    "navigationGraph": { "version": "1.2.0", "url": "..." },
    "fingerprint": {
      "version": "1.2.0",
      "generatedAt": "2026-07-24T12:00:00Z",
      "collectionDateRange": { "from": "2026-07-20", "to": "2026-07-24" },
      "wifi": {
        "floorCount": 3,
        "totalEntries": 360,
        "url": "https://r2.example.com/bldg-A/fingerprint-wifi-v1.2.0.zip"
      },
      "magnetic": {
        "floorCount": 3,
        "totalEntries": 360,
        "url": "https://r2.example.com/bldg-A/fingerprint-magnetic-v1.2.0.zip"
      },
      "pressure": {
        "floorCount": 3,
        "totalEntries": 360,
        "url": "https://r2.example.com/bldg-A/fingerprint-pressure-v1.2.0.zip"
      }
    }
  }
}
```

## 12. パイプライン実行トリガー

| トリガー | 説明 |
|---------|------|
| **手動実行（開発時）** | 開発者が `pipeline.py` を直接実行。引数で建物・フロア・入力パスを指定 |
| **GitHub Actions（CI/CD）** | 新しい Export JSON が所定の場所に push されたら自動実行 |
| **アプリ内実行（将来）** | 収集完了後、端末上で簡易パイプラインを実行し、Fingerprint DB のプレビューを生成（品質確認用） |

## 13. 品質レポート

パイプライン実行時に品質レポートを生成し、Fingerprint DB の信頼性を可視化する。

```json
{
  "buildingId": "bldg-A",
  "floorId": "F1",
  "generatedAt": "2026-07-24T12:00:00Z",
  "summary": {
    "totalEntries": 120,
    "interpolatedEntries": 18,
    "averageApCount": 8.3,
    "averageMagneticAnomalyScore": 0.22,
    "dataFreshnessDays": 4
  },
  "wifiQuality": {
    "excellentRatio": 0.45,
    "goodRatio": 0.35,
    "fairRatio": 0.15,
    "poorRatio": 0.05
  },
  "coverage": {
    "edgeCoverageRatio": 0.92,
    "uncoveredEdges": ["edge-015", "edge-022"],
    "nodeCoverageRatio": 1.0
  },
  "warnings": [
    { "type": "LOW_AP_COUNT", "edgeId": "edge-022", "apCount": 1 },
    { "type": "OLD_DATA", "edgeId": "edge-015", "daysSinceCollection": 95 }
  ]
}
```

## 14. Positioning Mode との接続

Fingerprint Engine（`06c_fingerprint-engine.md`）は、Map Assets から取得した Fingerprint DB ファイルを読み込み、`FingerprintEntry` のリストとしてメモリに展開する。

```text
【Positioning Mode 起動時】
Map Assets → Fingerprint DB ファイル群
  → FingerprintEngine.init(dbPath)
    → wifiEntries: List<FingerprintEntry>
    → magneticEntries: List<FingerprintEntry>
    → pressureEntries: List<FingerprintEntry>
    → 空間インデックス構築（Edge ID / グリッドID による高速照合用）
```

既存 `06c_fingerprint-engine.md` の `WifiFingerprintEngine` および `MagneticFingerprintEngine` は、この `FingerprintEntry` リストを入力として `SimilarityCalculator` で照合を行う。データモデルは本節で定義した `FingerprintEntry` / `WifiFingerprint` / `MagneticFingerprint` / `PressureFingerprint` を採用する。

> **注**: 既存 `06c` では Fingerprint DB の具体的なデータモデルが未定義であった。本設計をもって Fingerprint DB のデータ形式を確定させる。
