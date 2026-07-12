// MapIconLabel component - derived from source/labels/label.tsx + source/labels/labelUI/labelView.tsx
// Uses display_point, zoomLabel, unitSymbol for rendering.
// File saved as UTF-8 without BOM.
import React, { useMemo } from "react";
import type { FeatureCollection } from "geojson";
import { ShapeSource } from "@maplibre/maplibre-react-native";
import { LabelLayer } from "./labels/shareComp";
import { createLabelConfigs, LabelKey } from "./labels/LabelConfigs";
import { useProcessedUnitData } from "./processUnitData";
import type { ColorTheme } from "../constants/colorPalette";

type Props = {
  floor_num: number;
  data: FeatureCollection | null;
  isVisible: boolean;
  colorTheme: ColorTheme;
};

/**
 * MapIconLabel component that renders labels on the map.
 * - Extracts display_point geometry from feature properties (useMemo memoized)
 * - Renders labels via LabelLayer
 * - UnitSymbol (special symbols) is now rendered separately in MapScreen
 */
export function MapIconLabel({
  floor_num,
  data,
  isVisible,
  colorTheme,
}: Props) {
  // DD-05: processedFeatures を useMemo でメモ化（Hooks は早期リターン前に配置）
  const processedGeoJson: FeatureCollection | null = useProcessedUnitData(data);

  const labelConfigs = useMemo(
    () => createLabelConfigs(colorTheme),
    [colorTheme],
  );

  // REV-CRITICAL-2 fix: isVisible が false の場合は非表示
  if (!data || !processedGeoJson || !isVisible) return null;

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
    </>
  );
}
