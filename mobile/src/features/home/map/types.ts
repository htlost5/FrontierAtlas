// マップレイヤーで利用する型定義をまとめる。
import type { FeatureCollection } from "geojson";

export type GeoLayerProps = {
  data: FeatureCollection | null;
  visible?: boolean;
};

export type { CameraRegion, CameraAction } from "./hooks/camera/useCameraController/types";
export type { DisplayModeType } from "./hooks/state/useDisplayLevel";
export { DisplayMode } from "./hooks/state/useDisplayLevel";
