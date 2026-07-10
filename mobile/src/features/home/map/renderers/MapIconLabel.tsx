// MapIconLabel component - derived from source/labels/label.tsx + source/labels/labelUI/labelView.tsx
// Uses display_point, zoomLabel, unitSymbol for rendering.
// File saved as UTF-8 without BOM.
import React, { useMemo } from "react";
import { ShapeSource } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { LabelLayer } from "./labels/shareComp";
import { LABEL_CONFIGS, LabelKey } from "./labels/LabelConfigs";
import { UnitSymbol } from "./UnitSymbol";

type Props = {
  floor_num: number;
  data: FeatureCollection | null;
  isVisible: boolean;
};

/**
 * MapIconLabel component that renders icons on the map.
 * - Registers custom icons for MapLibre via MapIconRegistry (moved to MapContainer)
 * - Extracts display_point geometry from feature properties (useMemo memoized)
 * - Renders labels via LabelLayer
 * - Renders unit symbols, arrows, elevators, etc. via UnitSymbol
 */
export function MapIconLabel({ floor_num, data, isVisible }: Props) {
  // DD-05: processedFeatures を useMemo でメモ化（Hooks は早期リターン前に配置）
  const processedGeoJson: FeatureCollection | null = useMemo(() => {
    if (!data) return null;

    const processedFeatures = data.features
      .filter(
        (
          f,
        ): f is typeof f & { properties: NonNullable<typeof f.properties> } => {
          const dp = f.properties?.display_point;
          return (
            dp != null &&
            Array.isArray(dp.coordinates) &&
            dp.coordinates.length === 2
          );
        },
      )
      .map((f) => {
        // Normalize name structure: name_ja/name_en → name.ja/name.en
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
  }, [data]);

  if (!data || !processedGeoJson) return null;

  const labelSourceId = "lavelView";

  return (
    <>
      {/* DD-04: MapIconRegistry is moved to MapContainer level */}

      {/* GeoJSONデータをMapLibreのデータソースとして登録 */}
      <ShapeSource id={labelSourceId} shape={processedGeoJson}>
        {/* 縺吶∋縺ｦ縺ｮ繝ｩ繝吶Ν繧ｿ繧､繝励↓蟇ｾ縺励※繝ｬ繧､繝､繝ｼ繧堤函謌・*/}
        {(Object.keys(LABEL_CONFIGS) as LabelKey[]).map((key) => (
          <LabelLayer
            key={key}
            floor_num={floor_num}
            sourceId={labelSourceId}
            config={LABEL_CONFIGS[key]}
          />
        ))}
      </ShapeSource>

      {/* 繝医う繝ｬ繝ｻ繧ｨ繝ｬ繝吶・繧ｿ繝ｻ閾ｪ雋ｩ讖溘↑縺ｩ縺ｮ迚ｹ谿翫す繝ｳ繝懊Ν繧呈緒逕ｻ */}
      <UnitSymbol pointData={processedGeoJson} isVisible={isVisible ? 1 : 0} />
    </>
  );
}
