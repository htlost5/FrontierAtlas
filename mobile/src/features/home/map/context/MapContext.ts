// MapContext.ts
import type { CameraRef } from "@maplibre/maplibre-react-native";
import { createContext } from "react";

// MapScreen で使用する MapContext の型定義とコンテキストの作成
export type MapContextValue = {
  cameraRef: React.RefObject<CameraRef | null>;

  floor: number;
  setFloor: (n: number) => void;

  zoom: number;
  setZoom: (z: number) => void;

  moveTo: (center: [number, number], zoom?: number) => void;
};

export const MapContext = createContext<MapContextValue | null>(null);
