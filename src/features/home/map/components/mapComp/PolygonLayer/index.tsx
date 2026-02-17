import {
  FillLayer,
  LineLayer,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import { PolygonProps } from "./types";

export function PolygonLayer({
  prefixId,
  data,
  filter,
  fillStyle,
  lineStyle,
}: PolygonProps) {
  return (
    <ShapeSource id={`shapeSource_${prefixId}`} shape={data}>
      <FillLayer id={`fillLayer_${prefixId}`} filter={filter} style={fillStyle} />
      <LineLayer id={`lineLayer_${prefixId}`} filter={filter }style={lineStyle} />
    </ShapeSource>
  );
}
