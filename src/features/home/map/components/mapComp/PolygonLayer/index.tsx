import {
    FillLayer,
    LineLayer,
    ShapeSource,
} from "@maplibre/maplibre-react-native";
import { PolygonProps } from "./types";

export function PolygonLayer({
  prefixId,
  data,
  fillStyle,
  lineStyle,
}: PolygonProps) {
    
  return (
    <ShapeSource id={`shapeSource_${prefixId}`} shape={data}>
      <FillLayer id={`fillLayer_${prefixId}`} style={fillStyle} />
      <LineLayer id={`lineLayer_${prefixId}`} style={lineStyle} />
    </ShapeSource>
  );
}
