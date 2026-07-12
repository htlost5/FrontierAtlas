// ユニットデータから表示ポイントと名前正規化を行った GeoJSON を生成する共通ユーティリティ
import { useMemo } from "react";
import type { FeatureCollection } from "geojson";

/**
 * ユニットデータを加工し、display_point を geometry に持ち、
 * name_ja/name_en を name.ja/name.en に正規化した FeatureCollection を返す。
 */
export function processUnitData(
  data: FeatureCollection | null,
): FeatureCollection | null {
  if (!data) return null;

  const processedFeatures = data.features
    .filter(
      (f): f is typeof f & { properties: NonNullable<typeof f.properties> } => {
        const dp = f.properties?.display_point;
        return (
          dp != null &&
          Array.isArray(dp.coordinates) &&
          dp.coordinates.length === 2
        );
      },
    )
    .map((f) => {
      const normalizedProperties = { ...f.properties };
      if (
        normalizedProperties.name_ja != null &&
        normalizedProperties.name == null
      ) {
        normalizedProperties.name = {
          ja: normalizedProperties.name_ja,
          en: normalizedProperties.name_en ?? "",
        };
      }
      return {
        ...f,
        geometry: f.properties.display_point,
        properties: normalizedProperties,
      };
    });

  return {
    ...data,
    features: processedFeatures,
  };
}

/**
 * processUnitData を useMemo でラップした React Hook 版。
 */
export function useProcessedUnitData(
  data: FeatureCollection | null,
): FeatureCollection | null {
  return useMemo(() => processUnitData(data), [data]);
}
