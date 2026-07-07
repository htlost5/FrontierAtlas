// useMapCamera 用のカスタムHookを定義する。
import type { CameraRef } from "@maplibre/maplibre-react-native";
import { useEffect, useRef } from "react";
import { mapConfig } from "../../constants/mapConfig";

export function useMapCamera(
  cameraRef: React.RefObject<CameraRef | null>,
  initial?: { center: [number, number]; zoom?: number },
) {
  const initializedRef = useRef(false);

  useEffect(() => {
    const tryInit = () => {
      if (initializedRef.current) return;
      if (!cameraRef.current) {
        requestAnimationFrame(tryInit);
        return;
      }
      cameraRef.current.setCamera({
        centerCoordinate: initial?.center ?? mapConfig.default.center,
        zoomLevel: initial?.zoom ?? mapConfig.default.zoom,
        animationDuration: mapConfig.animation.duration.cameraInit,
      });
      initializedRef.current = true;
    };

    tryInit();
  }, [cameraRef, initial]);
}
