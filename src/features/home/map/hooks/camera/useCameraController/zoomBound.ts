import { mapConfig } from "../../../constants/mapConfig";
import { CameraAction } from "./types";

const EPSILON = 0.001;

export const zoomBoundary: CameraAction = (camera, region) => {
  const z = region?.properties?.zoomLevel;
  if (typeof z !== "number") return;

  if (z < mapConfig.zoom.softMin - EPSILON) {
    camera.setCamera({
      zoomLevel: mapConfig.zoom.softMin,
      animationDuration: 250,
    });
  }
};
