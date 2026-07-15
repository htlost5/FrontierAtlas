// types の型定義をまとめる。
import type { CameraRef } from "@maplibre/maplibre-react-native";

export type CameraRegion = {
  properties?: {
    zoomLevel?: number;
    center?: [number, number];
    visibleBounds?: [GeoJSON.Position, GeoJSON.Position]; // [northEast, southWest]
  };
};

export type CameraAction = (camera: CameraRef, region: CameraRegion) => void;
