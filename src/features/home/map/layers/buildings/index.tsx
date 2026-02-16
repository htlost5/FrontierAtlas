import {
    FillLayer,
    LineLayer,
    ShapeSource,
} from "@maplibre/maplibre-react-native";
import { buildingsFillLayer, buildingsLineLayer } from "./style";
import { BUILDING_KEYS, BuildingsProps } from "./types";

export function Buildings({ data }: BuildingsProps) {
  return (
    <>
      {BUILDING_KEYS.map((key) => {
        const value = data[key];
        if (!value) return null;

        return (
          <ShapeSource key={key} id={`shapeSource_${key}`} shape={value}>
            <FillLayer id={`fillLayer_${key}`} style={buildingsFillLayer} />
            <LineLayer id={`lineLayer_${key}`} style={buildingsLineLayer} />
          </ShapeSource>
        );
      })}
    </>
  );
}
