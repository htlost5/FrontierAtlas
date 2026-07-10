// MapIconLabel component - derived from source/labels/label.tsx + source/labels/labelUI/labelView.tsx
// Uses display_point, zoomLabel, unitSymbol for rendering.
// File saved as UTF-8 without BOM.
import React, { useMemo } from "react";
import { ShapeSource } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { LabelLayer } from "./labels/shareComp";
import { createLabelConfigs, LabelKey } from "./labels/LabelConfigs";
import { UnitSymbol } from "./UnitSymbol";
import type { ColorTheme } from "../constants/colorPalette";

type Props = {
  floor_num: number;
  data: FeatureCollection | null;
  isVisible: boolean;
  colorTheme: ColorTheme;
};

/**
 * MapIconLabel component that renders icons on the map.
 * - Registers custom icons for MapLibre via MapIconRegistry (moved to MapContainer)
 * - Extracts display_point geometry from feature properties (useMemo memoized)
 * - Renders labels via LabelLayer
 * - Renders unit symbols, arrows, elevators, etc. via UnitSymbol
 */
export function MapIconLabel({ floor_num, data, isVisible, colorTheme }: Props) {
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

  const labelConfigs = useMemo(
    () => createLabelConfigs(colorTheme),
    [colorTheme],
  );

  if (!data || !processedGeoJson) return null;

  const labelSourceId = "lavelView";

  return (
    <>
      {/* DD-04: MapIconRegistry is moved to MapContainer level */}

      {/* GeoJSONデータをMapLibreのデータソースとして登録 */}
      <ShapeSource id={labelSourceId} shape={processedGeoJson}>
        {/* 全てのラベルタイプに対してレイヤーを生成 */}
        {(Object.keys(labelConfigs) as LabelKey[]).map((key) => (
          <LabelLayer
            key={key}
            floor_num={floor_num}
            sourceId={labelSourceId}
            config={labelConfigs[key]}
          />
        ))}
      </ShapeSource>

      {/* 矢印・エレベータ・階段などのユニットシンボルを描画 */}
      <UnitSymbol pointData={processedGeoJson} isVisible={isVisible ? 1 : 0} />
    </>
  );
}
