# 05. プロジェクト構成

## 1. マルチレポ構成

本プロジェクトでは Multirepo を採用する。アプリ・測位エンジン・地図データ・ツール・研究コードをそれぞれのリポジトリで管理し、研究・実装・運用をそれぞれのプロジェクトに分離しながら、それぞれの責務を明確に分離する。

採用理由：
- アプリ・測位エンジン・地図データ・ツールを分離して管理できる
- 変更ログをそれぞれのプロジェクトごとに持てる
- バージョンの分離した設定を行いやすい

## 2. トップレベルディレクトリ構造

```text
FrontierAtlas/
├── mobile/           ← アプリケーション本体
├── position-engine/  ← ネイティブ測位エンジン
├── tools/            ← Map Assets 生成ツール群
├── research/         ← 研究用ディレクトリ
├── docs/             ← プロジェクト共有の設計書・仕様書
├── AGENTS.md
└── README.md
```

## 3. 各ディレクトリの責務

### mobile/

アプリケーション本体。

| サブディレクトリ | 説明 |
|---------------|------|
| `mobile/` | React Native アプリ。UI・MapLibre・Navigation・State を担当。測位計算・GeoJSON 生成・QGIS 処理は非担当 |

#### mobile/src/ ソースコード構造

`mobile/src/` は 7 レイヤ構成（AppInit / Config / Core / Domain / Features / Infra / Shared）で整理される。
詳細は `07a_mobile-source-structure.md` を参照。

### position-engine/

Android 専用機能を配置。研究で最も重要なディレクトリ。

| サブディレクトリ | 説明 |
|---------------|------|
| `position-engine/` | Sensor 取得・PDR・Wi-Fi Fingerprint・地磁気・Position Fusion・Map Matching・Bridge。UI・React Native・MapLibre 描画は非担当 |

### tools/

Map Assets を生成するツール群。

```text
tools/map-assets/
  QGIS/         ← QGIS プロジェクト・編集用データ（Node/Edge は point/line で作成）
  exports/      ← QGIS からエクスポートされた生データ配置先（データ変換前）
  builder/      ← 配布データ生成（座標変換・整形・Validation）
  scripts/      ← データ変換、リリースに関わるスクリプト
  build/        ← 変換後データ保存先（GPS座標版 / ローカル座標版 の両方を出力）
  releases/     ← 生成物の配置先
  worker-push/  ← Cloudflare Worker に関するスクリプト
```

#### Map Assets パイプライン（データフロー）

```text
QGIS（編集）
  ↓ point/line として Node/Edge を作成
exports/（生データ）
  ↓
builder/（データ変換ロジック）
  ├── GPS 座標版（WGS84） → MapLibre 用 GeoJSON
  └── ローカル座標版       → Position Engine 用（Node/Edge/Fingerprint/Graph）
  ↓
build/（変換後データ）
  ↓
releases/（リリースパッケージ）
  ↓ Cloudflare R2 経由で配布
mobile/ + position-engine/（アプリがダウンロード）
```

Node/Edge データは他の地物データ（フロアポリゴン・POI・Fingerprint DB）と**同一リリース**に同梱される。GPS 座標版とローカル座標版の紐付けは、建物ごとに一意な ID（buildingId）で管理する。

### research/

研究専用ディレクトリ。本番アプリとは責務を分離する。

```text
research/
  datasets/      ← 評価用データセット
  experiments/   ← 実験コード
  evaluation/    ← 評価指標・比較
  papers/        ← 論文
```

### docs/

設計書・仕様書・運用手順・README。

## 4. ディレクトリ依存関係

依存方向は**上から下のみ**。逆方向依存は禁止する。

### 4.1 依存関係図

```text
mobile/ ──────────→ tools/ ──────────→ assets（ビルド時変換）
  │                    │
  │  実行時参照（Map Assets Pipeline 出力）
  │                    │
  └────────────────────┘

position-engine/ ──→ tools/（Map Assets Pipeline 出力を実行時参照）

research/ ──→ mobile/, position-engine/（評価対象として参照）
```

### 4.2 依存ルール

| ルール | 説明 |
|--------|------|
| **ソースコード直接参照禁止** | 各プロジェクトが別プロジェクトのソースコードを `import` / `include` しない |
| **インターフェース依存** | プロジェクト間連携は公開 API・ファイル I/O・Web API のみで行う |
| **ビルド時分離** | `mobile/` と `position-engine/` は独立ビルド。統合は Gradle composite build により実行時に結合 |
| **データ共有** | 共有データ（Map Assets）は `tools/` が生成し、`mobile/` と `position-engine/` が読み取り専用で参照する |

### 4.3 プロジェクト間のデータフロー

```text
QGIS（編集）
  ↓
tools/map-assets/exports/（生データ）
  ↓
tools/map-assets/builder/（変換）
  ↓
tools/map-assets/releases/（リリースパッケージ）
  ↓ Cloudflare R2 経由で配布
mobile/ + position-engine/（ダウンロード・利用）
```

## 5. パッケージ管理

- **Gradle**: Kotlin 側。Node.js とは完全分離。
- **GitHub Release**: `assets` は GitHub Release を直接表さない。`assets（Source）→ Pipeline → Release → App` の流れとなる。
