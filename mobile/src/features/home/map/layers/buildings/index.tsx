// 建物レイヤーの描画コンポーネントを定義する。
import { PolygonLayer } from "../../components/mapComp/PolygonLayer";
import { buildingsFillStyle, buildingsLineStyle } from "./style";
import { BUILDING_KEYS, BuildingsProps } from "./types";

export function BuildingsView({ data, visible }: BuildingsProps) {
  return (
    <>
      {BUILDING_KEYS.map((key) => {
        const value = data[key];
        if (!value) return null;

        return (
          <PolygonLayer
            key={key}
            prefixId={`building_${key}`}
            data={value}
            visible={visible}
            fillStyle={buildingsFillStyle}
            lineStyle={buildingsLineStyle}
          />
        );
      })}
    </>
  );
}
