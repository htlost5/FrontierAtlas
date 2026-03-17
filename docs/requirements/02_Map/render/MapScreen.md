---
id: f8a2hzt0kum02ttghmhdi4d
title: tsx
desc: ''
updated: 1770813263759
created: 1770809478343
---

## MapScreen構築方法

### 責務分離

#### MapRoot

- マップのプロパティ初期設定
- moveTo関数定義：指定ズームと位置のカメラに移動
- contextへの受け渡し
- MapScreenのラップ
- childrenの受け取りトラップ
- memoでコンポーネント化

#### MapContext

- マップで利用するプロパティの型定義
- 型からコンテキストの作成
- コンテキスト利用の関数定義（hook）

#### MapScreen

- cacheReadyでキャッシュの準備状態を受け取り
- useMapGeoData, useFloorGeoDataでgeoDataの準備
- zoom定義で初期値を設定
- MIN_ZOOM, MAX_ZOOMの定義
- displayの状態をuseDisplayLevelから受け取り
- handleRegionIsChangingで、MIN_ZOOM, MAX_ZOOMを確認し、既定値を超えた場合に戻す
- map読込時のエラーを返す
- MapContainerを描画

#### MapContainer

- cameraRef, onRegionIsChanging, childrenを受け取り
- maplibreのMapViewをラップ -> regionChangingの受け渡しなど
- backgroundレイヤー定義
- camera定義

### 改善策

- プロパティの初期値をファイルで定義
- types.tsの作成
- MapContextのhook化
- handleRegionIsChangingの切り出し
- MaoScreenのコンテキスト下での管理

### 責務整理

#### MapContext.tsx

- contextの型定義
- useMapContext()でhookの提供

#### MapContainer

- そのままコンポーネントとして利用
- プロパティの値に関しては参照が好ましい