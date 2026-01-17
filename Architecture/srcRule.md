# ✅ 最終フォルダ構成レビュー: `/features/home/map`

## 📁 フォルダ構成（loadGeoJson.ts 除外済）

```
/home/map
├─ components
│   ├─ MapContainer.tsx         # <MapView> のラッパー
│   ├─ LoadingOverlay.tsx       # 読み込み時の UI 表示
│   └─ controls/
│       ├─ FloorChange.tsx      # フロア切替 UI
│       ├─ searchBar.tsx        # 検索バー
│       └─ userLocation.tsx     # 現在地ボタン
│
├─ hooks
│   ├─ useMapCamera.ts          # cameraRef の初期化・制御
│   ├─ useMapGeoData.ts         # GeoJSON データの取得・stateへの反映
│   ├─ useMapCache.ts           # in-memory キャッシュ管理
│   ├─ useDisplayLevel.ts       # zoom → display level 計算
│   └─ useMapEvents.ts          # onRegionIsChanging 等イベント処理
│
├─ layers
│   ├─ venue/                   # 敷地全体の描画
│   ├─ building/                # 学習棟・交流棟など建物群
│   └─ floor/
│       ├─ section/             # 区画
│       └─ unit/                # 部屋などのユニット
│
├─ renderers                   # MapLibre に依存する再利用描画部品
│   ├─ MapSymbol.tsx            # アイコン/シンボル描画
│   ├─ MapLabel.tsx             # ラベル描画
│   ├─ LayerSwitch.tsx          # 表示レイヤーの切替制御
│   └─ expressions/
│       ├─ expressionHelpers.ts # MapLibre DSLの生成補助
│       └─ filterMaker.ts       # 型安全なカテゴリフィルタ生成
│
├─ services
│   └─ parsers/
│       └─ geoJsonParser.ts     # GeoJSON を非同期 parse（UIブロック回避）
│
├─ state
│   ├─ selectionState.ts        # ユーザーが選択中の feature ID など
│   ├─ interactionState.ts      # 押下・選択モードなどの一時状態
│   ├─ viewState.ts             # floorNum / zoom / displayLevel 等のビュー状態
│   ├─ loadingState.ts          # venue / floor のロード状態
│   ├─ errorState.ts            # 取得エラーなどの状態
│   └─ index.ts                 # 各 state モジュールの集約エクスポート
│
├─ types.ts                    # FeatureCollection, DisplayLevel など型定義
├─ MapScreen.tsx              # hooks + compo をまとめた画面構成
└─ index.tsx                  # 外部用 export（tabs/home/index.tsx から参照）
```

---

## 📚 フォルダごとの責務まとめ

| フォルダ       | 役割と責務                                                                 |
|----------------|----------------------------------------------------------------------------|
| `components`   | ユーザーUI（マップ操作系）、状態は props 経由、MapLibre非依存             |
| `hooks`        | 副作用・非同期制御・MapLibreイベント処理、React依存処理をまとめる         |
| `layers`       | 「意味ある地物ごと」に描画責務を分離：venue, building, floor など          |
| `renderers`    | MapLibre 依存部品を共通化。シンボル描画、ラベル描画、レイヤー切替          |
| `services`     | パース・取得系のドメインロジック処理。I/Oは infra に逃がす（将来的に）     |
| `state`        | 状態（state）の定義、更新ロジック。純粋で副作用なし                        |
| `types.ts`     | GeoJSON/画面用型定義（全レイヤーで共通）                                  |

---

## ✅ 設計ルール総まとめ（履歴から抽出）

- MapLibre 依存は `renderers/` 以下に閉じ込める（抽象化して再利用可能に）
- フォルダの命名は「描画の意味」で決定（例：building は studyhall/interact を統合）
- UI・hooks・state・infra の責務を分離し、それぞれの独立性と再利用性を担保する
- データ取得 → services、表示 → layers、制御 → hooks、状態 → state に分割する
- 各 `state` モジュールは pure function に保ち、副作用は `hooks` 側で処理
- hooks は「使い方」に集中、内部ロジックは services / renderers に分離
- `MapScreen.tsx` は compose-only（ロジックは持たず、connect するだけ）

---

## ✅ 最終評価

- ✅ **構造・粒度：適切**
- ✅ **責務分離：良好**
- ✅ **拡張性：高い（新規 layer 追加が容易）**
- ✅ **保守性：高い（副作用・依存関係が整理済み）**

このまま「tools」「calendar」「classroom」に同様の構成を展開できます。
