// MapRoot.tsx
import { CameraRef } from "@maplibre/maplibre-react-native";
import React, { memo, useCallback, useRef, useState, startTransition } from "react";
import { StyleSheet, View } from "react-native";
import { MapScreen } from "./MapScreen";
import { MapContext } from "./context/MapContext";
import { mapConfig } from "./constants/mapConfig";

type Props = {
  children: React.ReactNode;
};

const MapRootBase = ({ children }: Props) => {
  const cameraRef = useRef<CameraRef>(null);
  const [floor, setFloor] = useState(mapConfig.default.floor);
  const [zoom, setZoom] = useState(mapConfig.default.zoom);

  // startTransition でラップした setFloor — フロア切替を非同期更新にし UI 応答性を維持
  const wrappedSetFloor = useCallback((n: number) => {
    startTransition(() => {
      setFloor(n);
    });
  }, []);

  const moveTo = useCallback((center: [number, number], nextZoom?: number) => {
    cameraRef.current?.setCamera({
      centerCoordinate: center,
      ...(nextZoom !== undefined ? { zoomLevel: nextZoom } : {}),
      animationDuration: 600,
    });
  }, []);

  return (
    <MapContext.Provider
      value={{ cameraRef, floor, setFloor: wrappedSetFloor, zoom, setZoom, moveTo }}
    >
      <View style={styles.root}>
        {/* Map は完全に背景 */}
        <View style={StyleSheet.absoluteFill}>
          <MapScreen cameraRef={cameraRef} />
        </View>

        {/* タブ・UI を上に重ねる */}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {children}
        </View>
      </View>
    </MapContext.Provider>
  );
};

MapRootBase.displayName = "MapRoot";
export const MapRoot = memo(MapRootBase);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
