// フロアレイヤーの型定義をまとめる。
import { GeoLayerProps } from "../../types";
import type { ColorTheme } from "../../constants/colorPalette";

export type FloorProps = {
  floorData: {
    units: GeoLayerProps["data"];
    sections: GeoLayerProps["data"];
  };
  stairsData: GeoLayerProps["data"];
  colorTheme: ColorTheme;
};
