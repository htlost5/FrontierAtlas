---
agent: DWR
task_id: TASK-proj-001
date: 2026-07-14
status: approved
category: shared
destination: docs/shared/search/specs/
related:
  - "[TASK-proj-001](../tasks/active/TASK-proj-001_proj-integration.md)"
  - "[REQ-proj-integration](../../impl/specs/2026-07-14_REQ-proj-integration.md)"
tags:
  - DWR
  - search
  - PROJ
  - coordinate-system
  - TASK-proj-001
---

# SR: PROJ 座標変換ライブラリ調査レポート

## 調査概要

| 項目 | 値 |
|------|-----|
| 調査対象 | PROJ 座標変換ライブラリ（proj4js） |
| 目的 | FrontierAtlas への導入可否判断および統合方針の策定 |
| 実施日 | 2026-07-14 |
| プロジェクト | FrontierAtlas（Expo SDK 57 + React Native 0.86 + MapLibre GL） |

---

## 1. PROJ 概要

### 1.1 PROJ とは

PROJ は [OSGeo 財団](https://www.osgeo.org/)が管理する汎用座標変換ソフトウェアである。地理空間座標を異なる座標参照系（CRS: Coordinate Reference System）間で変換するための標準ライブラリであり、以下のプロダクトの基盤として利用されている。

- **QGIS** — デスクトップ GIS
- **GDAL** — 地理空間データ変換ライブラリ
- **PostGIS** — PostgreSQL 空間拡張
- **MapServer** — Web マップサーバー

| 属性 | 値 |
|------|-----|
| 実装言語 | C |
| 最新バージョン | 9.8（2026年時点） |
| ライセンス | MIT |
| 所管 | OSGeo 財団 |

### 1.2 proj4js（JavaScript 版 PROJ）

proj4js は、C版 PROJ.4 および GCTPC（General Cartographic Transformation Package C）から JavaScript へ移植されたライブラリである。Node.js / ブラウザ / React Native 環境で動作する。

| 属性 | 値 |
|------|-----|
| npm パッケージ名 | `proj4` |
| 最新バージョン | 2.20.9（2026年6月） |
| 週間ダウンロード | 776,462 |
| ライセンス | MIT |
| TypeScript 型定義 | 同梱（`index.d.ts`） |
| 実装 | Pure JavaScript 100% |
| ネイティブ依存 | なし |
| Stars | 2.2k |
| Contributors | 61 |
| リポジトリ | <https://github.com/proj4js/proj4js> |
| ドキュメント | <https://proj4js.github.io/proj4js/> |
| 作成者 | ahocevar, calvinmetcalf |

---

## 2. コア API

### 2.1 基本変換

```typescript
import proj4 from 'proj4';

// 形式: proj4(fromCRS, toCRS, coordinates)
// 戻り値: 変換後の座標配列
const result = proj4('EPSG:4326', 'EPSG:3857', [-122.305887, 58.9465872]);
// result: [x, y]（メートル単位）
```

### 2.2 CRS 定義の登録

```typescript
// 名前付き定義の登録
proj4.defs(
  'EPSG:4326',
  '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'
);

proj4.defs([
  [
    'EPSG:6668',
    '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs',
  ],
]);
```

### 2.3 前方/逆方向変換

```typescript
const transformer = proj4('EPSG:4326', 'EPSG:3857');

// 前方変換（from → to）
const forward = transformer.forward([-122.305887, 58.9465872]);

// 逆方向変換（to → from）
const inverse = transformer.inverse(forward);
```

### 2.4 WKT 文字列の直接利用

```typescript
// QGIS からエクスポートした WKT 形式の CRS 定義を直接使用可能
const wkt = `PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",...]`;
const result = proj4(wkt, 'EPSG:4326', [x, y]);
```

### 2.5 カスタム CRS の定義

```typescript
// PROJ 文字列による任意の投影法定義
proj4.defs(
  'LOCAL_XY',
  '+proj=aeqd +lat_0=35.49777179199512 +lon_0=139.6784895108818 ' +
  '+x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
);
```

---

## 3. 組み込み定義済み CRS

以下の CRS は proj4js にデフォルトで定義されており、追加の `proj4.defs()` 呼び出しなしで即座に利用可能。

| EPSG コード | 名称 | 別名 |
|-------------|------|------|
| EPSG:4326 | WGS 84（緯度経度） | `WGS84` |
| EPSG:4269 | NAD83 | — |
| EPSG:3857 | Web Mercator（メートル） | `EPSG:3785`, `GOOGLE`, `EPSG:900913`, `EPSG:102113` |
| EPSG:32601–32660 | WGS84 / UTM zone 1N–60N | — |
| EPSG:32701–32760 | WGS84 / UTM zone 1S–60S | — |
| EPSG:5041 | WGS84 / UPS North | — |
| EPSG:5042 | WGS84 / UPS South | — |

> **注**: 日本測地系 JGD2011（EPSG:6668）や任意のローカル座標系を使用する場合は、`proj4.defs()` による明示的な定義登録が必要。

---

## 4. PROJ 文字列リファレンス

### 4.1 EPSG:4326 — WGS84 緯度経度（度単位）

```
+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs
```

| パラメータ | 意味 |
|-----------|------|
| `+proj=longlat` | 投影法：経緯度（非投影） |
| `+ellps=WGS84` | 楕円体：WGS84 |
| `+datum=WGS84` | 測地系：WGS84 |
| `+no_defs` | デフォルト定義ファイルを読まない |

### 4.2 EPSG:3857 — Web Mercator（メートル単位）

```
+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs
```

| パラメータ | 意味 |
|-----------|------|
| `+proj=merc` | 投影法：メルカトル |
| `+a=6378137` | 長半径（メートル） |
| `+b=6378137` | 短半径（メートル、球体近似） |
| `+lon_0=0` | 中央子午線 |
| `+units=m` | 単位：メートル |

### 4.3 JGD2011 — 日本測地系 2011（EPSG:6668）

```
+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs
```

| パラメータ | 意味 |
|-----------|------|
| `+ellps=GRS80` | 楕円体：GRS80 |
| `+towgs84=0,0,0,0,0,0,0` | WGS84 への変換パラメータ（日本では実質ゼロ） |

### 4.4 ローカル直交座標系 — Azimuthal Equidistant（メートル単位）

```
+proj=aeqd +lat_0=35.49777179199512 +lon_0=139.6784895108818 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs
```

| パラメータ | 意味 |
|-----------|------|
| `+proj=aeqd` | 投影法：正距方位図法（Azimuthal Equidistant） |
| `+lat_0=35.497...` | 投影中心の緯度 |
| `+lon_0=139.678...` | 投影中心の経度 |
| `+x_0=0 +y_0=0` | 偽東距・偽北距（原点オフセットなし） |
| `+units=m` | 単位：メートル |

> この定義により、マップ中心を原点 (0, 0) とした直交 XY 座標系（メートル単位）が得られる。中心からの距離・方位を正確に計算可能。

---

## 5. React Native / Expo 互換性評価

### 5.1 評価結果: ✅ 完全互換

| 評価項目 | 結果 | 備考 |
|---------|------|------|
| Pure JavaScript 実装 | ✅ | ネイティブモジュール不要 |
| Expo 制限抵触 | ✅ なし | Expo Go / Development Build 両対応 |
| TypeScript 型定義 | ✅ | `index.d.ts` 同梱 |
| Node.js `fs` 依存 | ⚠️ 部分あり | nadgrid ファイル読み込み等で `fs` を使用。基本変換は影響なし |
| バンドルサイズ | ✅ | minified ~180KB, gzipped ~50KB |
| Hermes エンジン互換 | ✅ | Pure JS のため Hermes で正常動作 |

### 5.2 制限事項

1. **nadgrid ファイル**: 高精度な測地系変換に用いる NTv2 グリッドファイルの読み込みは Node.js の `fs` モジュールに依存。React Native 環境では使用不可。ただし、FrontierAtlas のユースケース（WGS84 ↔ ローカル直交座標系）では不要。

2. **動的 CRS 定義のロード**: `proj4.defs()` によるプログラム的な定義登録は完全にサポートされる。

---

## 6. バンドルサイズ分析

| 形式 | サイズ |
|------|--------|
| Minified | ~180 KB |
| Gzipped | ~50 KB |

FrontierAtlas のアプリバンドル全体に対するインパクトは軽微であり、許容範囲内と判断する。

---

## 7. ライセンス互換性

| 項目 | 値 |
|------|-----|
| proj4js ライセンス | MIT |
| FrontierAtlas ライセンス | （確認要） |
| 互換性 | ✅ MIT は制約が最小限であり、商用利用・改変・再配布すべて許可 |

---

## 8. QGIS 連携

| 項目 | 詳細 |
|------|------|
| QGIS の内部実装 | C版 PROJ を使用 |
| PRJ ファイル形式 | WKT（Well-Known Text） |
| proj4js の WKT 対応 | ✅ `proj4(wktString)` で直接利用可能 |
| ワークフロー | QGIS で定義したカスタム CRS を `.prj` ファイルとしてエクスポート → そのまま proj4js で読み込み |

---

## 9. 調査結論

### 9.1 導入可否: ✅ 導入推奨

proj4js は以下の理由から FrontierAtlas への導入に適している：

1. **Pure JavaScript**: ネイティブビルド不要、Expo と完全互換
2. **軽量**: gzipped ~50KB でバンドルへの影響が小さい
3. **型安全**: TypeScript 型定義同梱
4. **QGIS 連携**: WKT 形式の直接サポートにより、GIS 担当者とのワークフローがシームレス
5. **MIT ライセンス**: 商用利用含め制約なし

### 9.2 期待される効果

| 現状 | 導入後 |
|------|--------|
| `METERS_PER_DEG_LAT = 111_320` の近似 | 正確な測地学的距離計算 |
| 緯度経度のみの座標系 | ローカル直交座標系（メートル単位）の利用 |
| 緯度による経度方向距離の手動補正 | 投影法による自動補正 |
| QGIS との座標定義の断絶 | WKT 共有による一貫性確保 |

### 9.3 推奨インストール方法

```bash
cd mobile
npx expo install proj4
```

> `expo install` を使用することで、Expo SDK との互換性が保証されたバージョンが選択される。
