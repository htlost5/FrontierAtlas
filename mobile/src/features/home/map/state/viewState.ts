// マップの表示状態を管理するための定義を置くファイル。
import { mapConfig } from "../constants/mapConfig";

export type ViewState = {
  floor: number;
  zoom: number;
  center: [number, number];
};

export const DEFAULT_VIEW_STATE: ViewState = {
  floor: mapConfig.default.floor,
  zoom: mapConfig.default.zoom,
  center: mapConfig.default.center as [number, number],
};
