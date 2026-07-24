# 07a. Mobile ソースコード構造

## 1. 概要

本ドキュメントは `mobile/src/` 配下のディレクトリ構造と各レイヤの責務を定義する。
ディレクトリ構造は **7レイヤ構成**（AppInit / Config / Core / Domain / Features / Infra / Shared）に整理され、
`02_design-principles.md` で定義された単一責務・レイヤ分離・依存方向の原則に従う。

## 2. 全体ディレクトリ構造

```text
mobile/src/
├── AppInit/                    ← アプリ起動時初期化
├── config/                     ← リモート設定
├── core/                       ← コアエンジン（座標変換・経路計算）
│   ├── coordinate/             ← 座標変換エンジン（GPS↔ローカル）
│   └── navigation/             ← 経路計算エンジン
├── domain/                     ← ドメイン型定義（マニフェスト・エラー）
├── features/                   ← 機能単位の UI（画面）
│   └── home/
│       ├── chrome/             ← 画面クローム（BottomTabBar 等）
│       │   └── bottomTabBar/
│       └── map/                ← 地図画面
│           ├── hooks/          ← 地図画面専用カスタムフック
│           ├── labels/         ← 地図ラベル表示
│           │   └── expressions/
│           ├── layers/         ← MapLibre レイヤ定義
│           │   └── floor/
│           ├── overlays/       ← 地図上オーバーレイ UI
│           │   └── controls/
│           ├── search/         ← 検索機能
│           └── settings/       ← 設定画面
├── infra/                      ← インフラストラクチャ層
│   ├── coordinate/             ← 座標変換ユーティリティ
│   ├── FileSystem/             ← ファイルシステム抽象化
│   ├── geojson/                ← GeoJSON 処理
│   ├── jsonParse/              ← JSON パースユーティリティ
│   ├── network/                ← ネットワーク通信
│   └── sha256/                 ← SHA-256 ハッシュ計算
└── shared/                     ← 共有モジュール
    ├── constants/              ← 定数定義（外部アプリ・スタイル・タイポグラフィ）
    ├── navigation/             ← 画面遷移定義
    └── services/               ← 共有サービス
```

## 3. レイヤ定義

### 3.1 レイヤ一覧

| レイヤ | ディレクトリ | 責務 |
|--------|-------------|------|
| **AppInit** | `AppInit/` | アプリ起動時のフォントロード・データ準備 |
| **Config** | `config/` | リモート設定の取得・管理 |
| **Core** | `core/` | 座標変換エンジン・経路計算エンジン |
| **Domain** | `domain/` | マニフェスト型・エラー型（ネットワーク/バージョン/マニフェスト）の定義 |
| **Features** | `features/home/` | ホーム画面の UI（マップ、クローム、検索、設定、オーバーレイ） |
| **Infra** | `infra/` | 座標変換、ファイルシステム、GeoJSON 処理、JSON パース、ネットワーク、SHA256 |
| **Shared** | `shared/` | 定数（外部アプリ、スタイル、タイポグラフィ）、ナビゲーション、外部アプリ起動サービス |

### 3.2 レイヤ間依存関係

依存方向は **上位レイヤ → 下位レイヤ** の一方向のみ。逆方向依存は禁止。

```text
Features  ──→ core/ ──→ Domain ──→ Shared
    │           │          │
    └───────────┼──────────┼──→ Infra
                │          │
           Config ─────────┘
                │
           AppInit ──→ Shared
```

| レイヤ | 依存可能なレイヤ |
|--------|----------------|
| **Features** | Core, Domain, Infra, Shared |
| **Core** | Domain, Infra, Shared |
| **Domain** | Shared |
| **Config** | Shared |
| **AppInit** | Shared |
| **Infra** | Shared（必要な場合のみ） |
| **Shared** | なし（他レイヤに依存しない） |

## 4. 各ディレクトリの詳細

### 4.1 AppInit（アプリ初期化）

アプリ起動時に一度だけ実行される初期化処理を配置する。

| 責務 | 内容 |
|------|------|
| フォントロード | カスタムフォントの非同期読み込み |
| データ準備 | 初回起動時のキャッシュ初期化・デフォルトデータ配置 |

**制約**:
- UI 描画を行わない
- 非同期処理のみを含む
- 初期化失敗時はエラー画面へ遷移するためのエラー情報を返す

### 4.2 Config（リモート設定）

リモートから取得するアプリ設定を管理する。

| 責務 | 内容 |
|------|------|
| リモート設定取得 | サーバからの設定 JSON 取得・パース |
| 設定キャッシュ | ローカルキャッシュ・フォールバック値の管理 |
| 設定更新検知 | 設定変更の検知とアプリ各部への通知 |

**制約**:
- UI を持たない
- 設定の型定義は Domain に依存しない（設定用の独立した型を持つ）

### 4.3 Domain（ドメイン型定義）

アプリ全体で共有される中核的な型定義を配置する。純粋な型定義のみを含み、実行ロジックは持たない。

| カテゴリ | 内容 |
|----------|------|
| マニフェスト型 | 建物マニフェスト、フロア定義、POI 定義の型 |
| エラー型 | ネットワークエラー、バージョン不一致エラー、マニフェスト不正エラーの型定義 |
| 共通型 | 座標型、建物 ID 型、フロア ID 型など |

**制約**:
- 実行ロジックを含まない（純粋な型定義のみ）
- Shared のみに依存可能
- Features / Infra の実装詳細を import しない

### 4.4 Features（機能 UI）

ユーザが直接操作する画面 UI を配置する。`features/home/` 配下にホーム画面の全要素を集約する。

```text
features/home/
├── chrome/                    ← 画面の枠組み（クローム）
│   └── bottomTabBar/          ← 下部タブバー
└── map/                       ← 地図画面
    ├── hooks/                 ← 地図画面ロジック（カスタムフック）
    ├── labels/                ← 地図上のテキストラベル
    │   └── expressions/       ← MapLibre データ駆動スタイル式
    ├── layers/                ← 地図レイヤ定義
    │   └── floor/             ← フロア切替レイヤ
    ├── overlays/              ← 地図上に重畳する UI 要素
    │   └── controls/          ← 地図操作コントロール（拡大縮小・コンパス等）
    ├── search/                ← 検索 UI
    └── settings/              ← 設定 UI
```

#### 4.4.1 Chrome（画面クローム）

| ディレクトリ | 責務 |
|-------------|------|
| `chrome/bottomTabBar/` | 下部タブバーの表示・タブ切替ロジック |

#### 4.4.2 Map（地図画面）

| ディレクトリ | 責務 |
|-------------|------|
| `hooks/` | 地図画面で使用するカスタムフック（useMapView, useCurrentLocation 等） |
| `labels/` | 地図上の POI 名・フロア名などのテキストラベル表示 |
| `labels/expressions/` | MapLibre の data-driven styling 用の式（条件付きスタイル） |
| `layers/` | MapLibre レイヤ（FillLayer, LineLayer, SymbolLayer）の定義 |
| `layers/floor/` | フロア切替に応じたレイヤ表示/非表示の制御 |
| `overlays/` | 地図キャンバス上に React Native View として重畳する UI |
| `overlays/controls/` | ズームボタン・コンパスボタン・現在地ボタン等の地図操作 UI |
| `search/` | POI・施設検索の UI と検索ロジック |
| `settings/` | 地図表示設定（レイヤ表示切替・フォントサイズ等）の UI |

**制約**:
- 測位ロジックを含まない（Position Engine の出力のみを利用）
- MapLibre の操作は hooks 経由で行い、コンポーネントから直接操作しない
- 各サブディレクトリは自身の責務範囲内のコードのみを含む

### 4.5 Core（コアエンジン）

アプリケーションのビジネスロジックを実行するエンジンを配置する。UI を持たず、Infra のユーティリティと Domain の型定義を利用して計算・変換を行う。

```text
core/
├── coordinate/                 ← 座標変換エンジン
│   ├── CoordinateTransformEngine.ts
│   └── types.ts
└── navigation/                 ← 経路計算エンジン
    ├── RouteCalculationEngine.ts
    └── types.ts
```

#### 4.5.1 CoordinateTransformEngine（座標変換エンジン）

| 項目 | 内容 |
|------|------|
| **責務** | GPS 座標（WGS84 lat/lon）↔ ローカル座標（建物原点からのメートル XY）の相互変換 |
| **入力** | 変換元座標（`LatLon` または `LocalPoint`）、`buildingId` |
| **出力** | 変換後座標 |
| **利用先** | Position Engine のライブ位置（ローカル座標）を MapLibre 表示用 GPS 座標に変換する |

**設計方針**:
- 建物ごとの変換パラメータ（原点 GPS 座標・スケール・回転）を `buildingId` で解決する
- 変換行列は初回計算後にキャッシュし、同一建物内では再計算しない
- 低レベルな数学演算（投影変換式・回転行列計算）は `infra/coordinate/` に委譲する
- Core 層は建物コンテキストの付与とキャッシュ管理に専念する

**infra/coordinate/ との関係**:
```
core/coordinate/（ビジネスロジック）
  ├── 建物原点管理
  ├── 変換パラメータ解決
  ├── キャッシュ管理
  └── infra/coordinate/ を呼び出し
        ├── 緯度経度→メートル投影変換式
        ├── 2点間距離計算
        └── 座標回転・スケーリング行列
```

#### 4.5.2 RouteCalculationEngine（経路計算エンジン）

| 項目 | 内容 |
|------|------|
| **責務** | Navigation Graph（Node / Edge）上での最短経路探索 |
| **入力** | 始点 Node ID、終点 Node ID、Navigation Graph |
| **出力** | 通過 Node / Edge ID の順序リスト（`Route { nodeIds[], edgeIds[] }`） |
| **利用先** | `features/home/map/hooks/` が経路表示時に呼び出す |

**設計方針**:
- エンジンはグラフ構造（Node / Edge の接続関係）のみを扱い、**座標情報を保持しない**
- 経路計算アルゴリズム（Dijkstra / A*）は Strategy パターンで交換可能
- 経路表示時は、出力された Node/Edge ID を基に UI 側が別途座標を引き当てて描画する
- 座標の引き当てと GPS 変換は `core/coordinate/` および Map Assets データを用いて UI 層が行う

**制約**:
- UI を一切含まない
- 座標データを直接扱わない（グラフトポロジーのみ）
- 状態を持たない（純粋関数）

### 4.6 Infra（インフラストラクチャ）

アプリ全体から利用される低レベルユーティリティ・サービスを配置する。
いずれも UI を持たず、純粋な処理ロジックのみを提供する。

| ディレクトリ | 責務 |
|-------------|------|
| `coordinate/` | 投影変換式・距離計算・回転/スケーリング行列（純粋数学ユーティリティ）。GPS↔ローカル座標のビジネスロジックは `core/coordinate/` が担当 |
| `FileSystem/` | ファイル読み書きの抽象化（RNFS のラッパー） |
| `geojson/` | GeoJSON のパース・バリデーション・簡易クエリ |
| `jsonParse/` | 安全な JSON パース（型ガード付き） |
| `network/` | HTTP クライアント・ダウンロード管理・再試行ロジック |
| `sha256/` | ファイル整合性検証用の SHA-256 ハッシュ計算 |

**制約**:
- UI を一切含まない
- 各モジュールは単一責務を持ち、他の Infra モジュールに依存しない
- プラットフォーム依存コードは Infra 層に集約し、上位レイヤに露出させない

### 4.7 Shared（共有モジュール）

アプリ全体で共有される定数・ナビゲーション定義・汎用サービスを配置する。
全レイヤから参照可能な最下位レイヤ。

| ディレクトリ | 責務 |
|-------------|------|
| `constants/` | 外部アプリ識別子、カラースタイル定数、タイポグラフィ定義 |
| `navigation/` | 画面遷移ルート定義（React Navigation のルートスタック） |
| `services/` | 外部アプリ起動（ディープリンク）等の共有サービス |

**制約**:
- 他レイヤに依存しない（循環参照の禁止）
- 状態を持たない（純粋な定義・ユーティリティのみ）
- プラットフォーム依存コードは Infra に委譲し、ここには置かない

## 5. アーキテクチャレイヤとの対応

本ディレクトリ構造は `07_react-native-layer.md` で定義されたアーキテクチャレイヤに以下のようにマッピングされる：

| アーキテクチャレイヤ | 対応ディレクトリ |
|---------------------|----------------|
| **Presentation Layer** | `features/home/`（画面 UI）, `shared/navigation/`（画面遷移） |
| **Application Layer** | `features/home/map/hooks/`（画面ロジック）, `core/`（エンジン呼び出し） |
| **Service Layer** | `infra/`（全モジュール）, `shared/services/` |
| **Domain Layer** | `domain/`（型定義） |
| **Infrastructure** | `AppInit/`, `config/`, `shared/constants/` |

### 5.1 Position Engine との関係

`07_react-native-layer.md` 第4節に定義された通り、React Native 側は Native Bridge 経由でのみ Position Engine と通信する。
`features/home/map/hooks/` が Bridge API を呼び出し、`infra/` 層のモジュールは Position Engine の内部構造を一切認識しない。

### 5.2 ライブ位置の座標変換フロー

Position Engine が出力するライブ位置はローカル座標系のみのため、MapLibre 上に表示するには `core/coordinate/` による GPS 座標への実行時変換が必要：

```text
Store（ローカル座標で位置を保持）
  ↓
core/coordinate/CoordinateTransformEngine.toGPS(localPoint, buildingId)
  ↓
GPS 座標を MapLibre Marker に渡して描画
```

> **注**: Map Assets の静的データ（GeoJSON 等）は Pipeline が GPS 座標版とローカル座標版の両方を生成済みのため、実行時変換は不要。ライブ位置のみが変換対象。

## 6. 設計上の制約

### 6.1 追加ルール

1. **Features 内のコンポーネントは Infra を直接 import してよい**（hooks 経由が推奨だが必須ではない）
2. **Domain の型は全レイヤから import 可能**
3. **Features のサブディレクトリ間での相互 import は禁止**（共有ロジックは hooks または Shared に抽出）
4. **新規 Infra モジュール追加時は単一責務を遵守する**

### 6.2 ファイル命名規則

| 種別 | 命名規則 | 例 |
|------|----------|-----|
| コンポーネント | `{ComponentName}.tsx` | `MapView.tsx` |
| カスタムフック | `use{Name}.ts` | `useMapCamera.ts` |
| 型定義 | `types.ts` | `manifest.ts` |
| サービス | `{Name}Service.ts` | `NetworkService.ts` |
| 定数 | `{category}.ts` | `colors.ts` |

## 7. 関連ドキュメント

- `05_project-structure.md` — マルチレポ全体構成
- `07_react-native-layer.md` — React Native アプリケーション層のアーキテクチャ
- `02_design-principles.md` — 設計思想・レイヤ分離原則
