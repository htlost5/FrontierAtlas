// GeoJSON の防御的サニタイズユーティリティ
// 連続重複座標の除去、縮退ポリゴンのフィルタリングを行い
// MapLibre Native の earcut 三角分割クラッシュを防止する

import type { FeatureCollection, Feature, Polygon, MultiPolygon, Position } from "geojson";

const EPSILON = 1e-12;

function coordsEqual(a: Position, b: Position): boolean {
  return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
}

/** リングから連続重複座標を除去し、閉じたリングを保証する */
function dedupeRing(ring: Position[]): Position[] | null {
  if (ring.length < 4) return null; // 最低3頂点+閉じ点

  const result: Position[] = [ring[0]];
  for (let i = 1; i < ring.length; i++) {
    if (!coordsEqual(ring[i], result[result.length - 1])) {
      result.push(ring[i]);
    }
  }

  // リングが閉じていることを保証
  if (result.length >= 3 && !coordsEqual(result[0], result[result.length - 1])) {
    result.push([...result[0]]);
  }

  return result.length >= 4 ? result : null;
}

function sanitizePolygon(polygon: Polygon): Polygon | null {
  const outer = dedupeRing(polygon.coordinates[0]);
  if (!outer) return null;

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
