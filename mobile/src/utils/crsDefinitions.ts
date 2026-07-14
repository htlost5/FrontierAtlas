import proj4 from "proj4";

/**
 * マップの中心座標（mapConfig.default.center と同期）
 */
export const MAP_CENTER = {
  lng: 139.6784895108818,
  lat: 35.49777179199512,
} as const;

/**
 * LOCAL_XY: マップ中心を原点とする Azimuthal Equidistant 投影のローカル直交座標系
 *
 * 用途:
 * - メートル単位での正確な距離計算
 * - QGIS で作成したローカル座標系データの取り込み
 * - 近距離（数km以内）での高精度な平面座標演算
 *
 * PROJ定義:
 *   +proj=aeqd  : Azimuthal Equidistant 投影（中心からの距離と方位を正確に保持）
 *   +lat_0/lon_0: 投影中心 = マップ中心
 *   +x_0/y_0=0  : 中心が原点 (0,0)
 *   +ellps=WGS84: WGS84 楕円体
 *   +units=m    : 出力単位 = メートル
 */
const LOCAL_XY_DEF =
  "+proj=aeqd +lat_0=35.49777179199512 +lon_0=139.6784895108818 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";

/**
 * CRS 定義のセットアップ
 * アプリ起動時に一度だけ呼び出す
 */
export function setupCRSDefinitions(): void {
  proj4.defs("LOCAL_XY", LOCAL_XY_DEF);

  // JGD2011（日本測地系2011）- 将来の拡張用
  proj4.defs(
    "EPSG:6668",
    "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
  );
}

export { proj4 };
export default proj4;
