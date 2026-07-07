// useMapCamera 用のカスタムHookを定義する。
import type { CameraRef } from "@maplibre/maplibre-react-native";
import { useEffect, useRef } from "react";

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
        centerCoordinate: initial?.center ?? [
          139.6784895108818, 35.49777179199512,
        ],
        zoomLevel: initial?.zoom ?? 17.2,
        animationDuration: 1000,
      });
      initializedRef.current = true;
    };

    tryInit();
  }, [cameraRef, initial]);
}
