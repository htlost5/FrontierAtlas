import {
  FillLayer,
  FillLayerStyle,
  LineLayer,
  LineLayerStyle,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import { PolygonProps } from "./types";

const OPACITY_TRANSITION = {
  delay: 0,
  duration: 200,
};

export function PolygonLayer({
  prefixId,
  data,
  visible,
  filter,
  fillStyle,
  lineStyle,
}: PolygonProps) {
  if (!data) return null;

  const finalFillStyle: FillLayerStyle = {
    ...fillStyle,
    fillOpacity: visible === false ? 0 : (fillStyle.fillOpacity ?? 1),
    fillOpacityTransition: OPACITY_TRANSITION,
  };

  const finalLineStyle: LineLayerStyle = {
    ...lineStyle,
    lineOpacity: visible === false ? 0 : (fillStyle.fillOpacity ?? 1),
    lineOpacityTransition: OPACITY_TRANSITION,
  };

  return (
    <ShapeSource id={`shapeSource_${prefixId}`} shape={data}>
      <FillLayer
        id={`fillLayer_${prefixId}`}
        filter={filter}
        style={finalFillStyle}
      />
      <LineLayer
        id={`lineLayer_${prefixId}`}
        filter={filter}
        style={finalLineStyle}
      />
    </ShapeSource>
  );
}
