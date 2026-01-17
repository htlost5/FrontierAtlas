# 最終ディレクトリ構成レビュー（home/map feature）

結論から述べます。

**提示された最終フォルダ構成は、これまで合意してきた設計ルールに完全に整合しており、
致命的な欠陥・大きな設計ミス・明確な実装漏れはありません。**
このまま「最終形」として運用可能です。

以下では、

1. 全体構造の妥当性評価
2. 不適切・改善余地がある点（軽微）
3. ディレクトリ全体の設計思想の整理
4. 各フォルダ・ファイルの役割詳細
5. これまで設定してきたルールの総括

を順に説明します。

---

## 1. 全体構造の妥当性評価

### 総評

* **feature-based 構成**：適切
* **UI / State / Data / Rendering / Infra の責務分離**：明確
* **MapScreen の責務肥大化は解消済み**
* **MapLibre 依存コードの隔離**：成功
* **home タブ専用機能としての閉じた構造**：良好

👉 **設計レベルとしては「中〜大規模React Nativeアプリで長期保守可能」な水準**

---

## 2. 軽微な指摘・改善余地（致命的ではない）

### 2.1 ファイル名の typo

```text
renderers/MapLavel.tsx
```

* `MapLabel.tsx` が正しい命名
* typo のみ。設計問題ではない

---

### 2.2 services / infra の境界（意図通りでOK）

* `services/loadGeoJson.ts`
* `infra/fileCache.ts`（別場所に存在している前提）

👉 現状は問題なし
👉 将来 `geoService.ts` に rename する余地あり（必須ではない）

---

### 2.3 layers/building の中身

```text
layers/building/index.tsx
```

* studyhall / interact を統合した抽象「building」として成立
* 今後 `buildingView.tsx`, `buildingConfig.ts` を分離しても良い

👉 **現時点では十分**

---

## 3. 全体設計思想（この構造が成立している理由）

この構成は、以下の **4つの軸で分離**されています。

| 軸       | 何を分離しているか                |
| ------- | ------------------------ |
| Feature | home/map に閉じた関心          |
| 意味      | venue / building / floor |
| 描画方法    | renderers                |
| 状態      | state + hooks            |

これにより：

* **意味（何を描くか）**
* **技術（どう描くか）**
* **状態（今どうなっているか）**
* **UI（ユーザー操作）**
* **データ取得（どこから来るか）**

が交差せずに整理されています。

---

## 4. 各フォルダ・ファイルの役割詳細

### 4.1 ルート直下

```text
index.tsx
```

* home/map feature の **公開API**
* app/(tabs)/home/index.tsx から import される唯一の入口

```text
MapScreen.tsx
```

* 画面のオーケストレーター
* hooks・state・layers・components を **組み立てるだけ**
* ロジックは持たない（重要）

```text
types.ts
```

* DisplayLevel / Geo 型 / 共通 enum
* state / hooks / layers で再利用

---

### 4.2 components（UI・操作系）

```text
components/
```

* **純UI**
* MapLibre の詳細を知らない

```text
MapContainer.tsx
```

* `<MapView>` をラップ
* children を受け取り描画のみ

```text
LoadingOverlay.tsx
```

* loadingState を視覚化

```text
controls/
```

* ユーザー操作（FloorChange, SearchBar, UserLocation）
* state / hooks を呼ぶ側

---

### 4.3 hooks（副作用・React依存ロジック）

```text
useMapCamera.ts
```

* camera 初期化・制御

```text
useMapGeoData.ts
```

* services + state を使ってデータ取得

```text
useMapCache.ts
```

* in-memory キャッシュ制御
* infra/fileCache とは役割分離済み

```text
useDisplayLevel.ts
```

* zoom → display の純変換ロジック＋throttle

```text
useMapEvents.ts
```

* onRegionIsChanging など Mapイベント集約

---

### 4.4 layers（意味を持つ描画単位）

```text
layers/venue
```

* 敷地全体（建物を含む地理的意味）

```text
layers/building
```

* studyhall / interact を抽象化
* 「同じ描画構造を持つ建物」

```text
layers/floor
```

* フロア単位描画
* section / unit を内包

👉 **ここには「何を描くか」しか書かない**

---

### 4.5 renderers（どう描くか）

```text
renderers/
```

* MapLibre 依存を隔離
* 再利用可能な低レベル描画部品

```text
MapSymbol.tsx
MapLabel.tsx
LayerSwitch.tsx
```

```text
renderers/expressions
```

```text
filterMaker.ts
expressionHelpers.ts
```

👉 **描画DSL（MapLibre expression）のみ**

---

### 4.6 services（データ取得の窓口）

```text
services/loadGeoJson.ts
```

* GeoJSON を取得する唯一の窓口
* FileSystem 依存はここまで

```text
services/parsers/geoJsonParser.ts
```

* JSON → FeatureCollection の変換
* InteractionManager を使用（適切）

---

### 4.7 state（単一ソース・オブ・トゥルース）

```text
selectionState.ts
```

* 選択中 unit / feature

```text
interactionState.ts
```

* 押下・操作状態

```text
viewState.ts
```

* floor / zoom / display

```text
loadingState.ts
```

* venue / floor loading

```text
errorState.ts
```

* エラー集約

```text
state/index.ts
```

* 外部公開窓口（直接 import 禁止）

---

## 5. これまで設定してきたルール（総括）

### 5.1 大原則

* **置き場所は「動くか」ではなく「意味」で決める**
* **技術依存は最下層へ押し込む**

---

### 5.2 フォルダごとの責務ルール

| フォルダ       | ルール             |
| ---------- | --------------- |
| components | UIのみ            |
| hooks      | 副作用・React依存     |
| layers     | 意味のある描画単位       |
| renderers  | 描画技術            |
| services   | データ取得           |
| state      | 状態定義            |
| infra      | OS / FileSystem |

---

### 5.3 禁止事項（守れている）

* ❌ MapScreen にロジック集中
* ❌ layers から FileSystem を触る
* ❌ state に副作用を書く
* ❌ renderers に意味を持たせる

---

## 最終結論

* **現状のフォルダ構成は完成形**
* 設計的に不適切な点・致命的な欠陥はなし
* このままスケール・保守・チーム開発が可能

この構造を理解しているエンジニアは、
**新規参入しても「どこに何を書くか」で迷いません。**
