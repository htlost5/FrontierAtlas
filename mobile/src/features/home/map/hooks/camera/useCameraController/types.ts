// types の型定義をまとめる。
import type { CameraRef } from "@maplibre/maplibre-react-native";

export type CameraRegion = {
  properties?: {
    zoomLevel?: number;
    center?: [number, number];
    visibleBounds?: [[number, number], [number, number]]; // [northEast, southWest]
  };
};

export type CameraAction = (camera: CameraRef, region: CameraRegion) => void;
