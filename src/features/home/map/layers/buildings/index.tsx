import { PolygonLayer } from "../../components/mapComp/PolygonLayer";
import { buildingsFillStyle, buildingsLineStyle } from "./style";
import { BUILDING_KEYS, BuildingsProps } from "./types";

export function BuildingsView({ data }: BuildingsProps) {
  return (
    <>
      {BUILDING_KEYS.map((key) => {
        const value = data[key];
        if (!value) return null;

        return (
          <PolygonLayer
            key={`building_${key}`}
            data={value}
            fillStyle={buildingsFillStyle}
            lineStyle={buildingsLineStyle}
          />
        );
      })}
    </>
  );
}
