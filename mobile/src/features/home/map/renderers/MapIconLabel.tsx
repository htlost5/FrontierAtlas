// MapIconLabel component - derived from source/labels/label.tsx + source/labels/labelUI/labelView.tsx
// Uses display_point, zoomLabel, unitSymbol for rendering.
// File saved as UTF-8 without BOM.
import { ShapeSource } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { MapIconRegistry } from "./MapIconRegistry";
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
 * - Registers custom icons for MapLibre via MapIconRegistry
 * - Extracts display_point geometry from feature properties
 * - Renders labels via LabelLayer
 * - Renders unit symbols, arrows, elevators, etc. via UnitSymbol
 */
export function MapIconLabel({ floor_num, data, isVisible }: Props) {
  if (!data) return null;

  // W6: Type guard ensuring filter narrows to features with non-null properties containing display_point
  const processedFeatures = data.features
    .filter((f): f is typeof f & { properties: NonNullable<typeof f.properties> } => {
      const dp = f.properties?.display_point;
      return dp != null && Array.isArray(dp.coordinates) && dp.coordinates.length === 2;
    })
    .map((f) => ({
      ...f,
      geometry: f.properties.display_point,
    }));

  // 蜃ｦ逅・ｸ医∩繝・・繧ｿ縺ｧGeoJSON繧ｪ繝悶ず繧ｧ繧ｯ繝医ｒ蜀肴ｧ区・
  const processedGeoJson: FeatureCollection = {
    ...data,
    features: processedFeatures,
  };

  const labelSourceId = "lavelView";

  return (
    <>
      {/* MapLibre縺ｧ菴ｿ逕ｨ縺吶ｋ驛ｨ螻九ち繧､繝励い繧､繧ｳ繝ｳ繧剃ｸ諡ｬ逋ｻ骭ｲ */}
      <MapIconRegistry />

      {/* GeoJSON繝・・繧ｿ繧樽apLibre縺ｮ繝・・繧ｿ繧ｽ繝ｼ繧ｹ縺ｨ縺励※逋ｻ骭ｲ */}
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
      <UnitSymbol
        pointData={processedGeoJson}
        isVisible={isVisible ? 1 : 0}
      />
    </>
  );
}

