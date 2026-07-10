// 建物レイヤーのスタイル定義をまとめる。
import type { FillLayerStyle, LineLayerStyle } from "@maplibre/maplibre-react-native";
import type { ZonePalette } from "../../constants/colorPalette";

export const getBuildingsFillStyle = (palette: ZonePalette): FillLayerStyle => ({
  fillColor: palette.fill,
  fillOpacity: palette.opacity,
});

export const getBuildingsLineStyle = (palette: ZonePalette): LineLayerStyle => ({
  lineColor: palette.line,
  lineWidth: 1.5,
});