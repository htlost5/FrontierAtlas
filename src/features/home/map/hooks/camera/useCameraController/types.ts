import type { CameraRef } from "@maplibre/maplibre-react-native";

export type CameraRegion = {
  properties?: {
    zoomLevel?: number;
    center?: [number, number];
  };
};

export type CameraAction = (
  camera: CameraRef,
  region: CameraRegion,
) => void;
