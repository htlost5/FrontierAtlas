// 建物レイヤーの描画コンポーネントを定義する。
import React from "react";
import { PolygonLayer } from "../../components/mapComp/PolygonLayer";
import {
  getBuildingsFillStyle,
  getBuildingsLineStyle,
  getBuildingFloorFillStyle,
  getBuildingFloorLineStyle,
} from "./style";
import { BUILDING_KEYS, BuildingsProps } from "./types";
import type { ColorTheme } from "../../constants/colorPalette";

type Props = BuildingsProps & {
  colorTheme: ColorTheme;
  variant?: "dim" | "floor";
};

export const BuildingsView = React.memo(function BuildingsView({
  data,
  visible,
  colorTheme,
  variant = "dim",
}: Props) {
  const isFloor = variant === "floor";

  return (
    <>
      {BUILDING_KEYS.map((key) => {
        const value = data[key];
        if (!value) return null;

        return (
          <PolygonLayer
            key={key}
            prefixId={isFloor ? `building_floor_${key}` : `building_${key}`}
            data={value}
            visible={visible}
            fillStyle={
              isFloor
                ? getBuildingFloorFillStyle(colorTheme.buildingFloor)
                : getBuildingsFillStyle(colorTheme.buildings)
            }
            lineStyle={
              isFloor
                ? getBuildingFloorLineStyle(colorTheme.buildingFloor)
                : getBuildingsLineStyle(colorTheme.buildings)
            }
          />
        );
      })}
    </>
  );
});
