import { mapConfig } from "../../../constants/mapConfig";
import { CameraAction } from "./types";

export const zoomBoundary: CameraAction = (camera, region) => {
  const z = region?.properties?.zoomLevel;
  if (typeof z !== "number") return;

  if (z < mapConfig.zoom.softMin) {
    camera.setCamera({
      zoomLevel: mapConfig.zoom.softMin,
      animationDuration: 250,
    });
  }

  // if (z > mapConfig.zoom.softMax) {
  //   camera.setCamera({
  //     zoomLevel: mapConfig.zoom.softMax,
  //     animationDuration: 250,
  //   });
  // }
};
