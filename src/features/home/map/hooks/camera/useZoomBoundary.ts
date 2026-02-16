import { CameraRef } from "@maplibre/maplibre-react-native";
import { useCallback } from "react";
import { mapConfig } from "../../constants/mapConfig";

export function useZoomBoundary(cameraRef: React.RefObject<CameraRef | null>) {
  return useCallback(
    (region: any) => {
      const z = region?.properties?.zoomLevel;
      if (!cameraRef.current || typeof z !== "number") return;

      if (z < mapConfig.zoom.softMin) {
        cameraRef.current.setCamera({
          zoomLevel: mapConfig.zoom.softMin,
          animationDuration: 250,
        });
      }

      // if (z > mapConfig.zoom.softMax) {
      //   cameraRef.current.setCamera({
      //     zoomLevel: mapConfig.zoom.softMax,
      //     animationDuration: 150,
      //   });
      // }
    },
    [cameraRef],
  );
}
