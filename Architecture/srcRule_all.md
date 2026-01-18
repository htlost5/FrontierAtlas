# ✅ 最終フォルダ構成レビュー: プロジェクト全体

## 📁 フォルダ構成

D:.
├─ AppInit
│   AppInitContext.ts
│   AppInitProvider.tsx
│   index.ts
│   useInitApp.ts
│   useLoadFonts.ts
│
├─ features
│  ├─ calendar
│  ├─ classroom
│  ├─ home
│  │  ├─ map
│  │  │   index.tsx
│  │  │   MapScreen.tsx
│  │  │   types.ts
│  │  │
│  │  │   ├─ components
│  │  │   │   ├─ LoadingOverlay.tsx
│  │  │   │   ├─ MapContainer.tsx
│  │  │   │   └─ controls
│  │  │   │       ├─ FloorChange.tsx
│  │  │   │       ├─ searchBar.tsx
│  │  │   │       └─ userLocation.tsx
│  │  │   │
│  │  │   ├─ hooks
│  │  │   │   ├─ useDisplayLevel.ts
│  │  │   │   ├─ useMapCache.ts
│  │  │   │   ├─ useMapCamera.ts
│  │  │   │   ├─ useMapEvents.ts
│  │  │   │   └─ useMapGeoData.ts
│  │  │   │
│  │  │   ├─ layers
│  │  │   │   ├─ building
│  │  │   │   │   └─ index.tsx
│  │  │   │   ├─ floor
│  │  │   │   │   ├─ index.tsx
│  │  │   │   │   ├─ section
│  │  │   │   │   └─ unit
│  │  │   │   └─ venue
│  │  │   │       └─ index.tsx
│  │  │   │
│  │  │   ├─ renderers
│  │  │   │   ├─ LayerSwitch.tsx
│  │  │   │   ├─ MapLabel.tsx
│  │  │   │   ├─ MapSymbol.tsx
│  │  │   │   ├─ expressions
│  │  │   │   │   ├─ expressionHelpers.ts
│  │  │   │   │   └─ filterMaker.ts
│  │  │   │   └─ labels
│  │  │   │       ├─ LabelConfig.ts
│  │  │   │       └─ shareComp.tsx
│  │  │   │
│  │  │   ├─ services
│  │  │   │   ├─ loadGeoJson.ts
│  │  │   │   └─ parsers
│  │  │   │       └─ geoJsonParser.ts
│  │  │   │
│  │  │   └─ state
│  │  │       ├─ index.ts
│  │  │       ├─ viewState.ts
│  │  │       ├─ loadingState.ts
│  │  │       ├─ errorState.ts
│  │  │       ├─ interactionState.ts
│  │  │       └─ selectionState.ts
│  │  │
│  │  └─ search
│  │      ├─ components
│  │      ├─ Context
│  │      │   └─ SearchContext.tsx
│  │      └─ services
│  │          ├─ googleTranslate.ts
│  │          └─ translation.ts
│  │
│  └─ tools
├─ infra
│   fileCache.ts
│   └─ AppInit
│       └─ functions
│           └─ cacheMake
│               └─ cacheMaker.ts
└─ shared
    ├─ components
    │   ├─ index.tsx
    │   ├─ bottomTabBar
    │   │   └─ bottomTabBar.tsx
    │   └─ Header
    │       └─ Header.tsx
    └─ hooks

## 📚 フォルダごとの責務まとめ

| フォルダ             | 役割と責務                                                                                                                                                     |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AppInit`            | アプリ全体の初期化処理（フォント読み込み、キャッシュ設定、コンテキスト生成）を担うフォルダ。起動時の前処理を集中管理し、各機能から共有される設定や依存性を提供する。|
| `features`           | ドメインごとの機能単位（タブや画面）を格納するトップレベルフォルダ。各サブフォルダ（home, calendar, classroom, tools など）にはそれぞれ独立した画面ロジックが含まれる。                              |
| `features/home/map`   | ホームタブの地図画面関連コード。`components` に UI、`hooks` にマップ制御ロジック、`layers` に地物別描画、`renderers` に地図依存の汎用描画部品、`services` にデータ取得・解析、`state` に状態管理を配置。|
| `features/home/search`| ホームタブの検索機能。検索UIコンポーネントと翻訳サービス（Google Translate など）を含む。                                                                       |
| `features/calendar`  | カレンダー関連画面を格納（予定表示や登録等）。同様の構造で独自のコンポーネント・ロジックを実装予定。                                                              |
| `features/classroom` | 教室関連画面を格納（教室予約や一覧等）。同様の構造で独自のコンポーネント・ロジックを実装予定。                                                                  |
| `features/tools`     | ツール系画面を格納（カメラ、計測機能など）。同様の構造で独自のコンポーネント・ロジックを実装予定。                                                              |
| `infra`              | ファイルキャッシュやバックグラウンドタスクなど、外部I/Oやプラットフォーム依存ロジックを格納。`fileCache.ts` はファイルシステムを用いたキャッシュ管理、`AppInit/functions` 以下に初期化タスク用の処理を配置。   |
| `shared`             | 複数タブから再利用可能な共通コンポーネントおよび共通 Hooks を配置。ボトムタブバーやヘッダー等のアプリ共通UI部品や、汎用的なカスタムフックを格納。                                      |

## ✅ 設計ルール総まとめ

- ライブラリや外部依存（例: MapLibre やネイティブモジュール等）の直接使用は専用モジュール/フォルダに閉じこめ、他の部分から抽象化して利用する。  
- フォルダ名は機能領域や目的に沿って命名する（例: `layers/building` は建物関連、`layers/floor` は階層関連の描画処理）。技術要素ではなくドメインや描画対象でグルーピングする。  
- UI コンポーネントとロジック/状態管理を分離する。`components` フォルダには純粋な View/UI を、`state` フォルダには状態定義と同期処理を、`hooks`/`services` フォルダには副作用や非同期ロジックを実装する。  
- データ取得やビジネスロジックは `services` に集約し、UI から分離する。視覚化に関する描画コードは `layers` や `renderers` に配置し、関心の分離を担保する。  
- 各状態管理モジュール（`state`）は純粋関数ベースとし、副作用はフック（`hooks`）側で処理する。これによりテスト容易性と再利用性を向上させる。  
- フック（`hooks`）は呼び出し側から使用しやすいインターフェースに注力し、内部ロジックは `services` や `renderers` に委譲する。これによりフック自体が軽く保たれ、内部実装の変更に強くなる。  
- 画面コンポーネント（例: `MapScreen.tsx`）はロジックを持たず、Hooks や共通コンポーネントを組み合わせて View を構成する。アプリ固有の状態や操作は外部に委譲し、Screen は純粋に表示の組み合わせに留める。  
- アプリケーション起動時の処理（フォントプリロード、キャッシュ生成など）は `AppInit` フォルダ内で完結させ、設定・依存性注入を一元管理することで、初期化ロジックを明確に分離する。  

## ✅ 最終評価

- **構造・粒度：適切** – フォルダごとの機能分割が明確であり、責任範囲が適切に設定されている。  
- **責務分離：良好** – UI、ロジック、副作用、状態管理が整理され、それぞれ独立性が保たれている。  
- **拡張性：高い** – 新規の機能追加（calendar/classroom/tools など）も、既存の規則に従って同様の構成を展開できるため、拡張しやすい。  
- **保守性：高い** – 副作用や外部依存が分離されているため、各モジュールのテストや変更管理が容易になっている。  
