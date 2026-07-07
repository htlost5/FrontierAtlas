# FrontierAtlas — 責務分離 設計書

<!--
  version: 1.0.0
  created: 2026-07-07
  status: draft
-->

## 1. 目的

FrontierAtlas プロジェクトの全コード・データ・ツールを、明確な責務境界で分割する。
アプリ実装・測位エンジン・地図資産生成・配布データ・共通ロジック・研究補助を独立したレイヤーに分離し、将来の拡張・実験に耐える構成を確立する。

---

## 2. レイヤー定義

```
FrontierAtlas/
│
├── apps/                    ← [レイヤー1] アプリ本体
│   ├── mobile/              ← Expo React Native（現在唯一のアプリ）
│   └── web/                 ← 将来追加: Web 版
│
├── native/                  ← [レイヤー2] ネイティブ実装
│   └── android-position-engine/    ← Kotlin 測位エンジン（将来）
│
├── packages/                ← [レイヤー3] 共有ロジック
│   ├── types/               ← 共有型定義
│   ├── geo/                 ← GeoJSON 読込・変換・検証
│   ├── map/                 ← MapLibre 地図表示共通処理
│   └── shared/              ← 共通ユーティリティ
│
├── assets/                  ← [レイヤー4] 配布用地図資産
│   └── maps/                ← building 別 GeoJSON
│
├── tools/                   ← [レイヤー5] 開発補助・生成ツール
│   └── map-assets/          ← QGIS 変換・リリース生成
│
├── research/                ← [レイヤー6] 研究・実験
│
├── docs/                    ← [レイヤー7] ドキュメント
│
├── package.json             ← npm workspaces 定義（ルート）
├── package-lock.json
└── node_modules/            ← 全ワークスペース共有（ホイスト）
```

---

## 3. 各レイヤーの責務

### 3.1 `apps/mobile/` — アプリ本体

**責務**: エンドユーザ向け React Native アプリケーション

| カテゴリ | 内容 |
|----------|------|
| UI / 画面 | Expo Router (`app/`) によるタブ、マップ画面、検索画面 |
| 状態管理 | React Context + useState（`features/home/map/context/`） |
| ナビゲーション | `@react-navigation/bottom-tabs`, `expo-router` |
| アプリ初期化 | フォント読込 → GeoJSON キャッシュ作成（`src/AppInit/`） |
| データ取得 | リモート GeoJSON ダウンロード + ローカルキャッシュ更新（`src/data/geojson/`） |
| 地図表示 | MapLibre GL Native（`@maplibre/maplibre-react-native`） |
| インフラ | FileSystem / Network / JSON Parse / SHA-256（`src/infra/`） |
| 設定 | `app.config.ts`, `eas.json`, `metro.config.cjs`, `tsconfig.json` |

**依存**:
- `assets/maps/` — バンドル埋込用 GeoJSON
- `packages/types/` — 型定義（将来）
- `packages/geo/` — GeoJSON 操作（将来）
- `packages/map/` — 地図表示共通（将来）

**禁止**:
- 測位ロジックを直接持たない（`native/` に委譲）
- データ変換スクリプトを含まない（`tools/` に委譲）
- 研究用アドホックコードを含まない（`research/` に委譲）

---

### 3.2 `native/android-position-engine/` — 測位エンジン

**責務**: Android ネイティブ測位（将来実装）

| カテゴリ | 内容 |
|----------|------|
| センサー | 加速度・ジャイロ・磁気・気圧 |
| 測位アルゴリズム | PDR / フィルタ / 位置推定 |
| React Native ブリッジ | Native Module 経由で `apps/mobile/` へ位置情報提供 |

**現状**: 未実装。本レイヤーは将来の配置先として定義。

---

### 3.3 `packages/` — 共有ロジック

**責務**: 複数アプリ・ツール間で共有する純粋なロジック

#### `packages/types/`
```
- GeoJSON FeatureCollection 拡張型
- MapId / BuildingId / FloorId 型
- Manifest 型（BuildManifest / LocalManifest）
- ネットワークレスポンス型
```

#### `packages/geo/`
```
- GeoJSON 読込・検証
- Registry 管理（geojsonRegistry）
- Manifest 差分検出（setUpdatePlan）
- ローカル/リモートマニフェスト管理
```

#### `packages/map/`
```
- MapLibre スタイル定義
- レイヤー構成
- 座標系変換（WGS84 ↔ ローカル）
```

#### `packages/shared/`
```
- 共通ユーティリティ
- ファイル操作ヘルパー
- ハッシュ計算（SHA-256）
```

**現状**: 未分離。`mobile/src/data/`, `mobile/src/domain/`, `mobile/src/infra/` に混在。
移行時に抽出。

**禁止**:
- React / React Native / Expo への依存（純粋 TS にする）
- 画面レンダリング

---

### 3.4 `assets/maps/` — 配布用地図資産

**責務**: アプリアップデートなしで更新可能な地図データ

| カテゴリ | 内容 |
|----------|------|
| GeoJSON | `buildingA/`, `buildingB/` 単位のフロア・ユニット・経路データ |
| マニフェスト | `manifest.json` — バージョン・sha256・サイズ情報 |
| 配布方法 | GitHub Releases 経由でアプリがダウンロード |

**現状**: `mobile/assets/maps/` に存在。アプリバンドルに `require()` で埋め込まれている。
→ 将来的に `assets/maps/` へ分離予定。

**更新フロー**:
```
QGIS → exports → transform → build → release → GitHub Pages → アプリDL
```

---

### 3.5 `tools/map-assets/` — 地図資産生成ツール

**責務**: 地図データの変換・検証・リリース作成

| サブディレクトリ | 責務 |
|-----------------|------|
| `QGIS/` | QGIS プロジェクトファイル、エクスポートスクリプト（`allExports1.py`） |
| `transformer/` | GeoJSON → JSON 変換（`.geojson` 拡張子除去、`fid` プロパティ削除） |
| `builder/` | マニフェスト生成、バージョン情報生成、ZIP リリース作成、latest 更新 |
| `exports/` | `base/`（QGIS 生出力の静的データ）, `build/`（変換後データ） |
| `meta/` | `latest.json` — 最新バージョン参照 |
| `docs/` | 座標管理メモ |

**依存**: `archiver`（ZIP 作成用）

**ワークフロー**:
```
1. QGIS で allExports1.py 実行 → exports/build/ に出力
2. transformer/transform.js 実行 → .geojson → .json 変換
3. builder/build-release.js {version} 実行 → ZIP, manifest, version 生成
4. builder/update-latest.js {version} 実行 → meta/latest.json 更新
```

---

### 3.6 `tools/scripts/` — 開発スクリプト

**責務**: アプリ開発補助スクリプト

| スクリプト | 役割 |
|-----------|------|
| `build-data-load.js` | リモートから最新 GeoJSON をDLし `mobile/assets/maps/` に展開 |
| `generate_geojsonAssetMap.js` | `manifest.json` から `geojsonAssetMap.ts` を自動生成 |

**依存**: `unzipper`（ホイスト解決）

---

### 3.7 `research/` — 研究・実験

**責務**: 本番コードと独立した実験・評価

| カテゴリ | 内容 |
|----------|------|
| 実験スクリプト | 測位精度評価、パラメータ調整 |
| データ可視化 | Jupyter Notebook / Python スクリプト |
| 評価データ | ログ、グラフ、比較結果 |
| 論文・発表資料 | 研究メモ、参照文献 |

**禁止**: 本番アプリコードからの import（本番に研究コードを混入させない）

**現状**: 未作成。

---

### 3.8 `docs/` — ドキュメント

| ファイル | 内容 |
|----------|------|
| `architecture-responsibility-separation.md` | 本ドキュメント |
| （将来）`architecture/*.md` | アーキテクチャ設計書 |
| （将来）`specs/*.md` | 機能仕様書 |
| （将来）`research/*.md` | 研究ノート |

---

## 4. 現状からの移行計画

### 4.1 完了済み ✅

| 変更 | 内容 |
|------|------|
| `app/` → `mobile/` | アプリディレクトリのリネーム |
| `geo-data-repo/` → `tools/map-assets/` | 地図ツールの分離 |
| `app/scripts/` → `tools/scripts/` | 生成スクリプトの分離 |
| `app/assets/data/` → `mobile/assets/maps/` | 地図資産のリネーム |
| npm workspaces 導入 | ルート `node_modules` にホイスト |

### 4.2 将来の移行（検討中）

| 優先度 | 変更 | リスク | 備考 |
|--------|------|--------|------|
| 低 | `mobile/assets/maps/` → `assets/maps/` | 高 | `require()` による静的 import が Expo Metro バンドルに影響 |
| 中 | `mobile/src/domain/` → `packages/types/` | 中 | 純粋 TS 型の抽出。react/react-native 非依存の型のみ移動可 |
| 中 | `mobile/src/infra/geojson/` → `packages/geo/` | 中 | geojsonRegistry の移行。Expo FileSystem 依存を分離する必要あり |
| 低 | `mobile/src/infra/sha256/` → `packages/shared/` | 低 | 純粋関数なので移行容易 |
| 高 | `native/android-position-engine/` 作成 | — | 新規実装。測位研究の成果を統合 |
| 低 | `research/` 作成 | — | 新規。実験スクリプトを置く場所を確保 |

---

## 5. 依存関係ルール

```
research/ ──→ （本番コードに依存しない・されない）

docs/    ──→ （コードに依存しない・されない）

assets/  ──→ （コードに依存しない）
     ↑
apps/    ──→ assets/      （静的 import）
     ↑
packages/──→ （npm パッケージのみに依存）

native/  ──→ （Android SDK のみに依存）
     ↑
apps/    ──→ native/      （React Native Bridge 経由）

tools/   ──→ （Node.js 標準 + npm パッケージに依存）
```

### 禁止された依存

| 方向 | 理由 |
|------|------|
| `packages/` → `apps/` | 共有ロジックが特定アプリに依存してはいけない |
| `packages/` → `react` / `react-native` / `expo` | 共有ロジックは純粋 TS であるべき |
| `assets/` → `apps/` | データがコードに依存してはいけない |
| `research/` → `apps/` | 研究コードが本番コードに依存してはいけない |
| `tools/` → `apps/` | ツールがアプリコードに依存してはいけない |

---

## 6. npm Workspaces 構成

```json
// root package.json
{
  "name": "frontieratlas-monorepo",
  "private": true,
  "workspaces": [
    "apps/mobile",
    "apps/web",
    "packages/types",
    "packages/geo",
    "packages/map",
    "packages/shared",
    "tools/map-assets"
  ]
}
```

**現在の workspaces**: `["mobile", "tools/map-assets"]`

**ホイスト**: 全ワークスペースの依存がルート `node_modules/` に統合される。
`tools/scripts/` は workspace ではないが、ルートにホイストされた依存を自動解決。

---

## 7. 技術スタック早見表

| レイヤー | 技術 |
|----------|------|
| `apps/mobile/` | Expo SDK 55, React 19, React Native 0.83, TypeScript 5.9, MapLibre GL |
| `tools/map-assets/` | Node.js, archiver (ZIP), ogr2ogr (QGIS), GitHub Actions |
| `packages/` | TypeScript（純粋） |
| `native/` | Kotlin, Android SDK |
