import type { CameraRef } from "@maplibre/maplibre-react-native";
import { useEffect } from "react";

export function useMapCamera(
  cameraRef: React.RefObject<CameraRef | null>,
  initial?: { center: [number, number]; zoom?: number },
) {
  const center = initial?.center;
  const zoom = initial?.zoom;

  useEffect(() => {
    const initCamera = () => {
      if (!cameraRef.current) {
        requestAnimationFrame(initCamera);
        return;
      }
      cameraRef.current.setCamera({
        centerCoordinate: center ?? [139.6784895108818, 35.49777179199512],
        zoomLevel: zoom ?? 17.2,
        animationDuration: 1000,
      });
    };

    initCamera();
  }, [cameraRef, center, zoom]);
}
