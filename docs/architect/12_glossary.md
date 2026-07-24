# 12. 用語集

## 本書について

FrontierAtlas プロジェクトで使用される固有用語の定義集。

---

## A

### AP（Access Point）
Wi-Fi アクセスポイント。Wi-Fi Fingerprint 測位で BSSID（MAC アドレス）を識別子として利用する。

---

## B

### Bridge（ブリッジ）
React Native と Kotlin 間の通信層。API 呼び出し（命令）と Event 通知（Push）を仲介する。測位計算は一切行わない。

### BSSID（Basic Service Set Identifier）
Wi-Fi アクセスポイントの MAC アドレス。Fingerprint 照合のキーとして利用する。

---

## C

### Confidence（信頼度）
位置推定結果の確からしさを表す 0.0〜1.0 の値。HIGH（≥0.7）/ MEDIUM（0.4〜0.7）/ LOW（<0.4）の3段階レベルを持つ。
詳細は `10_shared-data-models.md` §2 参照。

### Collection Mode（収集モード）
Fingerprint DB を構築するためのセンサーデータ収集を行う Position Engine の動作モード。ユーザが正しい位置（Ground Truth）を指定する。

---

## E

### Edge（エッジ）
Navigation Graph において、2つの Node を結ぶ通路区間。方向性を持ち、長さ情報を持つ。

### Event Engine（イベントエンジン）
Position Engine の最上位サブレイヤ。Map Matching 後の位置情報を監視し、意味のある変化のみを React Native に通知する。

---

## F

### Fingerprint（フィンガープリント）
事前に収集された、特定位置におけるセンサー特徴量（Wi-Fi の BSSID/RSSI、地磁気ベクトルなど）。照合により絶対位置を推定する。

### Fingerprint DB
Fingerprint 照合用に最適化されたデータベース。Wi-Fi Fingerprint DB と Magnetic Fingerprint DB から構成される。

### Fusion（フュージョン）
PDR（相対位置）と Fingerprint（絶対位置候補）の測位結果を統合し、最終的な推定位置を生成する処理。

---

## G

### GeoJSON
地理空間データの標準フォーマット（RFC 7946）。MapLibre の地図描画データとして利用する。

### Graph（グラフ）
→ Navigation Graph を参照。

### Ground Truth（グラウンドトゥルース）
収集モードにおいて、ユーザが明示的に指定する正しい現在位置。Fingerprint DB 構築の基準となる。

---

## H

### Heading（ヘディング）
利用者の進行方向（方位角）。PDR Engine が推定する。

---

## L

### Local Coordinate System（ローカル座標系）
建物ごとに定義される相対座標系。建物原点からのメートル単位 XY。Position Engine 内部の全計算で使用する。

---

## M

### Manifest（マニフェスト）
Map Assets のバージョン・構成情報を含むメタデータファイル。アプリ起動時に更新判定に使用する。

### Map Assets（マップアセット）
QGIS で作成・管理される建物地図データ一式。GeoJSON / Wi-Fi DB / Magnetic DB / Navigation Graph / Metadata / Floor 情報を含む。GPS 座標版とローカル座標版の両方が同一リリースに同梱される。

### Map Assets Pipeline（マップアセットパイプライン）
QGIS データ → 変換 → 検証 → リリースパッケージ生成 の一連の処理フロー。`tools/map-assets/` で管理。

### MapLibre
オープンソースの地図描画ライブラリ。GeoJSON をベースにベクトルタイル地図を描画する。

### Map Matching（マップマッチング）
Fusion が生成した推定位置を、建物の構造制約（通路・部屋・壁・階）に適合させる処理。

---

## N

### Navigation Graph（ナビゲーショングラフ）
Node と Edge で構成される建物内の通路ネットワーク。経路計算と Map Matching の両方で利用される。

### Node（ノード）
Navigation Graph の頂点。通路の交差点・曲がり角・POI などに配置される。

---

## P

### PDR（Pedestrian Dead Reckoning）
加速度・ジャイロなどの慣性センサーを用いて、歩行者の相対移動量（歩数×歩幅×方向）を推定する手法。

### POI（Point of Interest）
地図上の興味対象地点。店舗・トイレ・エレベータなどの位置情報。

### Position Engine（ポジションエンジン）
FrontierAtlas の中核コンポーネント。センサー取得〜位置推定〜イベント通知までの全測位処理を Kotlin ネイティブ側で実行する。

### Positioning Mode（測位モード）
Fingerprint DB を用いて現在位置を推定する Position Engine の通常動作モード。

---

## R

### RSSI（Received Signal Strength Indicator）
Wi-Fi 信号の受信強度（dBm）。Fingerprint 照合の主要な特徴量。

### Route（ルート）
Navigation Graph 上の経路。Node/Edge ID の順序リストとして表現される。

---

## S

### Sensor Layer（センサー層）
Position Engine の最下層。Android センサー API からデータを取得し、上位レイヤに統一形式で提供する。

---

## W

### WGS84
世界測地系 1984（World Geodetic System 1984）。GPS で使用される緯度経度座標系。MapLibre の地図描画はこの座標系を使用する。

### Wi-Fi Fingerprint（Wi-Fi フィンガープリント）
特定位置で観測される Wi-Fi AP の BSSID と RSSI の組み合わせ。位置推定の特徴量として利用する。
