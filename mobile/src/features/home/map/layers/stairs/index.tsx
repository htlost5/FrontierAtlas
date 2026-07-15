// stairs.geojson を階層別に描画する StairsLayer コンポーネント
import React, { useMemo } from "react";
import {
  ShapeSource,
  LineLayer,
  type LineLayerStyle,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import type { StairsPalette } from "../../constants/colorPalette";
import { buildStairsFilter } from "./filter";

const OPACITY_TRANSITION = {
  delay: 0,
  duration: 200,
};

type Props = {
  data: FeatureCollection | null;
  currentFloor: number;
  palette: StairsPalette;
  visible?: boolean;
};

export const StairsLayer = React.memo(function StairsLayer({
  data,
  currentFloor,
  palette,
  visible = true,
}: Props) {
  const filter = useMemo(
    () => buildStairsFilter(currentFloor),
    [currentFloor],
  );

  if (!data) return null;

  const lineStyle: LineLayerStyle = {
    lineColor: palette.lineColor,
    lineWidth: palette.lineWidth,
    lineOpacity: visible === false ? 0 : palette.lineOpacity,
    lineOpacityTransition: OPACITY_TRANSITION,
  };

  return (
    <ShapeSource id="shapeSource_stairs" shape={data}>
      <LineLayer
        id="stairs_layer"
        filter={filter}
        style={lineStyle}
      />
    </ShapeSource>
  );
});
