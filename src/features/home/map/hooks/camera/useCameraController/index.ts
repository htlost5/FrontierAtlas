import { CameraRef } from "@maplibre/maplibre-react-native";
import { useCallback } from "react";
import { CameraAction, CameraRegion } from "./types";

export function useCameraController(
  cameraRef: React.RefObject<CameraRef | null>,
  actions: CameraAction[],
) {
  return useCallback(
    (region: CameraRegion) => {
      if (!cameraRef.current) return;
      actions.forEach((action) => action(cameraRef.current!, region));
    },
    [cameraRef, actions],
  );
}
