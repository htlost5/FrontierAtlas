// 建物レイヤーの描画コンポーネントを定義する。
import React from "react";
import { PolygonLayer } from "../../components/mapComp/PolygonLayer";
import { getBuildingsFillStyle, getBuildingsLineStyle } from "./style";
import { BUILDING_KEYS, BuildingsProps } from "./types";
import type { ColorTheme } from "../../constants/colorPalette";

type Props = BuildingsProps & {
  colorTheme: ColorTheme;
};

export const BuildingsView = React.memo(function BuildingsView({
  data,
  visible,
  colorTheme,
}: Props) {
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
            fillStyle={getBuildingsFillStyle(colorTheme.buildings)}
            lineStyle={getBuildingsLineStyle(colorTheme.buildings)}
          />
        );
      })}
    </>
  );
});
