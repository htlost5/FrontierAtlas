// style のスタイル定義をまとめる。
import type {
  FillLayerStyle,
  LineLayerStyle,
} from "@maplibre/maplibre-react-native";
import type { RoomCategoryPalette } from "../../constants/colorPalette";

export const getVenueFillStyle = (
  palette: RoomCategoryPalette,
): FillLayerStyle => ({
  fillColor: palette.fill,
  fillOpacity: palette.opacity,
});

export const getVenueLineStyle = (
  palette: RoomCategoryPalette,
): LineLayerStyle => ({
  lineColor: palette.line,
  lineWidth: 1,
});
