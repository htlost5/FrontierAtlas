---
agent: DWR
task_id: TASK-proj-001
date: 2026-07-14
status: approved
category: shared
destination: docs/shared/impl/specs/
related:
  - "[TASK-proj-001](../tasks/active/TASK-proj-001_proj-integration.md)"
  - "[SR-proj-research](../../search/specs/2026-07-14_SR-proj-research-proj.md)"
tags:
  - DWR
  - requirements
  - PROJ
  - coordinate-system
  - TASK-proj-001
---

# REQ: PROJ 座標変換ライブラリ統合要件定義

## 1. 概要

### 1.1 目的

FrontierAtlas に PROJ 座標変換ライブラリ（proj4js）を導入し、緯度経度（EPSG:4326）ベースの座標計算を正確な測地学的計算に置き換える。また、屋内マップ向けのローカル直交座標系（メートル単位）を導入し、高精度な位置計算を実現する。

### 1.2 対象範囲

- パッケージ `proj4` のインストールと型定義の利用
- ローカル直交座標系（Azimuthal Equidistant）の定義と登録
- 既存の `METERS_PER_DEG_LAT` 近似計算の置き換え
- QGIS との CRS 定義共有基盤の整備

### 1.3 対象外

- WGS84 以外の全球測地系（JGD2011 等）への対応（将来的な拡張余地として CRS 定義のみドキュメント化）
- 高精度 nadgrid 変換（NTv2 グリッドファイルは React Native 非対応のため）
- バックエンド（Cloudflare Workers）側の座標変換

---

## 2. 機能要件

### FR-01: proj4 パッケージの導入

| 項目 | 値 |
|------|-----|
| 優先度 | 高 |
| パッケージ | `proj4`（npm） |
| バージョン | ^2.20.0 |
| インストール方法 | `npx expo install proj4` |
| 型定義 | パッケージ同梱の `index.d.ts` を利用 |

**受入条件**:
- [ ] `package.json` の `dependencies` に `proj4` が追加されている
- [ ] `import proj4 from 'proj4'` が型エラーなく利用可能
- [ ] `npx tsc --noEmit` がパスする

---

### FR-02: ローカル直交座標系の定義

| 項目 | 値 |
|------|-----|
| 優先度 | 高 |
| CRS 名 | `LOCAL_XY` |
| 投影法 | Azimuthal Equidistant（`+proj=aeqd`） |
| 中心座標 | `[139.6784895108818, 35.49777179199512]`（`mapConfig.default.center` と同一） |
| 単位 | メートル（`+units=m`） |

**PROJ 定義文字列**:
```
+proj=aeqd +lat_0=35.49777179199512 +lon_0=139.6784895108818 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs
```

**受入条件**:
- [ ] `proj4.defs('LOCAL_XY', '...')` で CRS が登録されている
- [ ] `proj4('EPSG:4326', 'LOCAL_XY', [lng, lat])` でメートル単位の XY 座標が取得できる
- [ ] 中心座標 `[139.678..., 35.497...]` の変換結果が `[0, 0]` に近似する（誤差 < 1mm）

---

### FR-03: 座標変換ユーティリティモジュールの作成

| 項目 | 値 |
|------|-----|
| 優先度 | 高 |
| 作成ファイル | `mobile/src/utils/coordinateTransform.ts` |
| 内容 | proj4 をラップした座標変換ヘルパー関数群 |

**提供する関数**:

```typescript
// EPSG:4326 → ローカル直交座標系（メートル）
function toLocalXY(lng: number, lat: number): [number, number];

// ローカル直交座標系 → EPSG:4326
function fromLocalXY(x: number, y: number): [number, number];

// 2点間の距離（メートル、測地学的正確計算）
function distanceMeters(
  from: [number, number],
  to: [number, number]
): number;

// EPSG:4326 → EPSG:3857（Web Mercator）
function toWebMercator(lng: number, lat: number): [number, number];

// EPSG:3857 → EPSG:4326
function fromWebMercator(x: number, y: number): [number, number];
```

**受入条件**:
- [ ] 全関数が TypeScript の型定義を持つ
- [ ] 全関数に JSDoc コメントが付与されている
- [ ] `distanceMeters()` の計算結果が既存の `METERS_PER_DEG_LAT` 近似と比較して高精度である
- [ ] ユニットテストが作成されている（FR-05 参照）

---

### FR-04: 既存コードの置き換え

| 優先度 | 中 |
|--------|-----|

**対象ファイル**: `mobile/src/features/home/map/hooks/camera/useCameraController/boundsBound.ts`

**現状**:
```typescript
const METERS_PER_DEG_LAT = 111_320;
const metersPerDegLng =
  METERS_PER_DEG_LAT * Math.cos(centerLat * (Math.PI / 180));
const insetDegLat = inset / METERS_PER_DEG_LAT;
const insetDegLng = inset / metersPerDegLng;
```

**変更後**:
```typescript
import { toLocalXY, fromLocalXY } from '@/utils/coordinateTransform';

// inset（メートル）から ne/sw 座標を計算する
function insetToBounds(inset: number): {
  ne: [number, number];
  sw: [number, number];
} {
  const centerLng = (bounds.ne[0] + bounds.sw[0]) / 2;
  const centerLat = (bounds.ne[1] + bounds.sw[1]) / 2;

  // 中心をローカルXYに変換し、inset 分拡大した後、緯度経度に戻す
  const [cx, cy] = toLocalXY(centerLng, centerLat);
  const ne = fromLocalXY(cx + inset, cy + inset);
  const sw = fromLocalXY(cx - inset, cy - inset);

  return { ne, sw };
}
```

**受入条件**:
- [ ] `boundsBound.ts` から `METERS_PER_DEG_LAT` 定数と `lerp` 内の手動補正が削除されている
- [ ] 既存の全テストケースで同等以上の精度が確認できる
- [ ] `npx expo start` で正常起動する

---

### FR-05: ユニットテスト

| 優先度 | 高 |
|--------|-----|

**テスト対象**:
1. `toLocalXY` / `fromLocalXY` の往復変換精度
2. `distanceMeters` の計算精度（既知の2点間距離との比較）
3. `insetToBounds` の境界値テスト（inset=0, 80, 境界外）
4. ローカル座標系中心が `[0, 0]` になることの検証

**受入条件**:
- [ ] 全テストがパスする
- [ ] 往復変換の誤差が 1mm 未満
- [ ] `distanceMeters` の誤差が 0.1% 未満

---

### FR-06: CRS 定義の一元管理

| 優先度 | 中 |
|--------|-----|

**作成ファイル**: `mobile/src/utils/crsDefinitions.ts`

```typescript
import proj4 from 'proj4';

// デフォルトの mapConfig 中心座標と同期
export const MAP_CENTER = {
  lng: 139.6784895108818,
  lat: 35.49777179199512,
} as const;

// カスタム CRS 定義
export const CRS_DEFINITIONS = {
  LOCAL_XY: `+proj=aeqd +lat_0=${MAP_CENTER.lat} +lon_0=${MAP_CENTER.lng} +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs`,
  JGD2011:
    '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs',
} as const;

// アプリ起動時に全カスタム CRS を登録
export function registerCRS(): void {
  proj4.defs('LOCAL_XY', CRS_DEFINITIONS.LOCAL_XY);
  proj4.defs('EPSG:6668', CRS_DEFINITIONS.JGD2011);
}
```

**受入条件**:
- [ ] `registerCRS()` が `AppInitContext` または同等の初期化ポイントで呼び出される
- [ ] `MAP_CENTER` と `mapConfig.default.center` が単一の source of truth から派生している

---

## 3. 非機能要件

### NFR-01: パフォーマンス

| 項目 | 要件 |
|------|------|
| 座標変換のレイテンシ | 1回あたり 1ms 未満 |
| メモリ使用量 | 追加 1MB 未満 |
| バンドルサイズ増加 | gzipped 50KB 以内 |

### NFR-02: 互換性

| 項目 | 要件 |
|------|------|
| Hermes エンジン | 対応必須 |
| Expo Go | 対応必須 |
| Development Build | 対応必須 |
| iOS / Android | 両対応必須 |
| 型安全性 | `strict: true` でコンパイル通過 |

### NFR-03: 保守性

| 項目 | 要件 |
|------|------|
| CRS 定義の一元管理 | `crsDefinitions.ts` で集中管理 |
| QGIS との相互運用 | WKT 形式での定義共有が可能であること |
| ドキュメント | 全公開関数に JSDoc 付与 |

---

## 4. 段階的導入計画

### Phase 1: 基盤導入（本 REQ のスコープ）

1. `proj4` インストール
2. `coordinateTransform.ts` 作成
3. `crsDefinitions.ts` 作成と初期化フック
4. `boundsBound.ts` の置き換え
5. ユニットテスト

### Phase 2: 発展的活用（将来タスク）

1. 屋内ローカル座標系を用いたジオフェンス判定
2. フロア間の相対位置計算
3. QGIS からエクスポートしたカスタム CRS の動的読み込み
4. 複数フロアの座標系統合管理

---

## 5. リスクと対応策

| リスク | 影響度 | 対応策 |
|--------|--------|--------|
| proj4js の Hermes 非互換 | 高 | Pure JS 実装のためリスクは極小。インストール後即座に検証 |
| バンドルサイズの許容超過 | 低 | gzipped 50KB は許容範囲。万一超過してもコード分割で対応可 |
| `fs` 依存パスの誤検知 | 低 | 基本変換のみ使用のため影響なし。問題発生時は metro.config でエイリアス |
| 座標変換精度の不足 | 中 | 往復変換テストで検証。許容誤差 1mm 未満を基準 |

---

## 6. 受入基準サマリ

- [ ] `proj4` が依存関係に追加され、型エラーなく import 可能
- [ ] `LOCAL_XY` 座標系が定義され、中心座標の変換結果が `[0, 0]` と一致
- [ ] `coordinateTransform.ts` の全関数が実装・テスト済み
- [ ] `boundsBound.ts` の近似計算が測地学的正確計算に置き換え済み
- [ ] 全ユニットテストがパス
- [ ] `npx tsc --noEmit` がエラーゼロ
- [ ] `npx expo start` で正常起動
- [ ] 既存機能（マップ表示、カメラ制御、制限領域）が regression なく動作
