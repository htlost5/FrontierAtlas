// 建物レイヤーのスタイル定義をまとめる。
import type {
  FillLayerStyle,
  LineLayerStyle,
} from "@maplibre/maplibre-react-native";
import type { RoomCategoryPalette } from "../../constants/colorPalette";

export const getBuildingsFillStyle = (
  palette: RoomCategoryPalette,
): FillLayerStyle => ({
  fillColor: palette.fill,
  fillOpacity: palette.opacity,
});

export const getBuildingsLineStyle = (
  palette: RoomCategoryPalette,
): LineLayerStyle => ({
  lineColor: palette.line,
  lineWidth: 1.5,
});

export const getBuildingFloorFillStyle = (
  palette: RoomCategoryPalette,
): FillLayerStyle => ({
  fillColor: palette.fill,
  fillOpacity: palette.opacity,
});

export const getBuildingFloorLineStyle = (
  palette: RoomCategoryPalette,
): LineLayerStyle => ({
  lineColor: palette.line,
  lineWidth: 1,
});
