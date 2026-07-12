/**
 * GeoJSON カテゴリ正規化ユーティリティ
 * データ読み込み時に適用し、typo や表記ゆれを統一する
 */

import { normalizeCategory } from "@/src/features/home/map/layers/floor/unit/rooms/filter";
import type { FeatureCollection, Feature } from "geojson";

/**
 * GeoJSON FeatureCollection 内の全 feature の category プロパティを正規化する
 */
export function normalizeGeoJSONCategories(
  geojson: FeatureCollection,
): FeatureCollection {
  return {
    ...geojson,
    features: geojson.features.map((feature) => {
      const props = feature.properties;
      if (!props || !props.category) return feature;
      return {
        ...feature,
        properties: {
          ...props,
          category: normalizeCategory(props.category),
        },
      } as Feature;
    }),
  };
}
