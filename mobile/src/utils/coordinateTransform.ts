import proj4 from "proj4";
import { setupCRSDefinitions } from "./crsDefinitions";

// モジュールロード時にCRS定義を登録
setupCRSDefinitions();

/**
 * EPSG:4326 (緯度経度) → ローカル直交座標系 LOCAL_XY (メートル)
 * @param lng 経度 (WGS84)
 * @param lat 緯度 (WGS84)
 * @returns [x, y] メートル単位。中心座標 (MAP_CENTER) が原点 [0, 0]
 */
export function toLocalXY(lng: number, lat: number): [number, number] {
  return proj4("EPSG:4326", "LOCAL_XY", [lng, lat]);
}

/**
 * ローカル直交座標系 LOCAL_XY (メートル) → EPSG:4326 (緯度経度)
 * @param x ローカルX座標（メートル）
 * @param y ローカルY座標（メートル）
 * @returns [lng, lat] WGS84 緯度経度
 */
export function fromLocalXY(x: number, y: number): [number, number] {
  return proj4("LOCAL_XY", "EPSG:4326", [x, y]);
}

/**
 * 2点間の正確な距離（メートル）を計算する
 * ローカル直交座標系でユークリッド距離を計算
 * 近距離（〜数km）で高精度
 * @param from [lng, lat] 始点
 * @param to [lng, lat] 終点
 * @returns 距離（メートル）
 */
export function distanceMeters(
  from: [number, number],
  to: [number, number],
): number {
  const [x1, y1] = toLocalXY(from[0], from[1]);
  const [x2, y2] = toLocalXY(to[0], to[1]);
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * EPSG:4326 (緯度経度) → EPSG:3857 (Web Mercator, メートル)
 * @param lng 経度
 * @param lat 緯度
 * @returns [x, y] Web Mercator 座標（メートル）
 */
export function toWebMercator(lng: number, lat: number): [number, number] {
  return proj4("EPSG:4326", "EPSG:3857", [lng, lat]);
}

/**
 * EPSG:3857 (Web Mercator, メートル) → EPSG:4326 (緯度経度)
 * @param x Web Mercator X（メートル）
 * @param y Web Mercator Y（メートル）
 * @returns [lng, lat] WGS84 緯度経度
 */
export function fromWebMercator(x: number, y: number): [number, number] {
  return proj4("EPSG:3857", "EPSG:4326", [x, y]);
}
