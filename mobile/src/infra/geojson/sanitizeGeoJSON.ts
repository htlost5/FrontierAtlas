// GeoJSON の防御的サニタイズユーティリティ
// 連続重複座標の除去、縮退ポリゴンのフィルタリングを行い
// MapLibre Native の earcut 三角分割クラッシュを防止する

import type { FeatureCollection, Feature, Polygon, MultiPolygon, Position } from "geojson";

const EPSILON = 1e-12;
const COLLINEAR_EPSILON = 1e-10;  // 共線判定の許容誤差
const MIN_AREA = 1e-12;            // 最小面積閾値

function coordsEqual(a: Position, b: Position): boolean {
  return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
}

/**
 * 3点が同一線上にあるかを判定する（三角形の面積≒0で判定）
 * クロス積を用いた面積計算で共線性をチェック
 */
function areCollinear(a: Position, b: Position, c: Position): boolean {
  // 三角形の符号付き面積 = 0.5 * |cross(b-a, c-a)|
  const area = Math.abs(
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  );
  return area < COLLINEAR_EPSILON;
}

/**
 * Shoelace formula で閉じたリングの面積を計算
 * 戻り値は符号付き面積（正=反時計回り、負=時計回り）
 */
function ringArea(ring: Position[]): number {
  let area = 0;
  const n = ring.length;
  for (let i = 0; i < n - 1; i++) {
    area += ring[i][0] * ring[i + 1][1];
    area -= ring[i + 1][0] * ring[i][1];
  }
  return area / 2;
}

/** リングから連続重複座標と共線の中間点を除去し、閉じたリングを保証する。
 * 面積が閾値未満の縮退リングは null を返す。 */
function dedupeRing(ring: Position[]): Position[] | null {
  if (ring.length < 4) return null; // 最低3頂点+閉じ点

  // Step 1: 重複連続座標の除去
  const deduped: Position[] = [ring[0]];
  for (let i = 1; i < ring.length; i++) {
    if (!coordsEqual(ring[i], deduped[deduped.length - 1])) {
      deduped.push(ring[i]);
    }
  }

  // Step 2: 閉環チェック（開いていれば閉じる）
  if (deduped.length >= 3 && !coordsEqual(deduped[0], deduped[deduped.length - 1])) {
    deduped.push([...deduped[0]]);
  }

  // Step 3: 最小頂点数チェック
  if (deduped.length < 4) return null;

  // Step 4: 共線の中間点を除去（先頭と末尾は残す）
  // 3点ずつ見ていき、共線であれば中間点をスキップ
  const nonCollinear: Position[] = [deduped[0]];
  for (let i = 1; i < deduped.length - 1; i++) {
    // 前後の点と共線でなければ採用
    if (!areCollinear(nonCollinear[nonCollinear.length - 1], deduped[i], deduped[i + 1])) {
      nonCollinear.push(deduped[i]);
    }
  }
  // 末尾の点を追加
  nonCollinear.push(deduped[deduped.length - 1]);

  // Step 5: 最小頂点数再チェック（共線除去後）
  if (nonCollinear.length < 4) return null;

  // Step 6: 面積チェック
  const area = Math.abs(ringArea(nonCollinear));
  if (area < MIN_AREA) {
    return null;
  }

  return nonCollinear;
}

function sanitizePolygon(polygon: Polygon): Polygon | null {
  const outer = dedupeRing(polygon.coordinates[0]);
  if (!outer) {
    return null;
  }

  const holes: Position[][] = [];
  for (let i = 1; i < polygon.coordinates.length; i++) {
    const hole = dedupeRing(polygon.coordinates[i]);
    if (hole) holes.push(hole);
  }

  return { type: "Polygon", coordinates: [outer, ...holes] };
}

function sanitizeMultiPolygon(multi: MultiPolygon): MultiPolygon | null {
  const polygons: Polygon["coordinates"][] = [];
  for (const polyCoords of multi.coordinates) {
    const sanitized = sanitizePolygon({ type: "Polygon", coordinates: polyCoords });
    if (sanitized) polygons.push(sanitized.coordinates);
  }
  return polygons.length > 0 ? { type: "MultiPolygon", coordinates: polygons } : null;
}

function sanitizeGeometry(geometry: Feature["geometry"]): Feature["geometry"] | null {
  if (!geometry) return null;
  switch (geometry.type) {
    case "Polygon":
      return sanitizePolygon(geometry);
    case "MultiPolygon":
      return sanitizeMultiPolygon(geometry);
    case "GeometryCollection":
      return {
        ...geometry,
        geometries: geometry.geometries
          .map(sanitizeGeometry)
          .filter((g): g is NonNullable<typeof g> => g != null),
      };
    default:
      return geometry; // Point, LineString, MultiPoint, MultiLineString はそのまま
  }
}

/**
 * FeatureCollection 内の全フィーチャのジオメトリをサニタイズする。
 * 無効化されたフィーチャは除去される。
 */
export function sanitizeFeatureCollection(fc: FeatureCollection): FeatureCollection {
  if (!fc || !Array.isArray(fc.features)) return fc;

  const sanitized = fc.features
    .map((f) => {
      const geom = sanitizeGeometry(f.geometry);
      if (!geom) return null;
      return { ...f, geometry: geom };
    })
    .filter((f): f is Feature => f != null);

  return { ...fc, features: sanitized };
}
