// style のスタイル定義をまとめる。
import type {
  FillLayerStyle,
  LineLayerStyle,
} from "@maplibre/maplibre-react-native";
import type { ZonePalette } from "../../../../constants/colorPalette";

export const getSectionFillStyle = (palette: ZonePalette): FillLayerStyle => ({
  fillColor: palette.fill,
  fillOpacity: palette.opacity,
});

export const getSectionLineStyle = (palette: ZonePalette): LineLayerStyle => ({
  lineColor: palette.line,
  lineWidth: 1.5,
});
