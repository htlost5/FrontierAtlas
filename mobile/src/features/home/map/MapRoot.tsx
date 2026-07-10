// MapRoot.tsx
import { CameraRef } from "@maplibre/maplibre-react-native";
import React, {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { MapScreen } from "./MapScreen";
import { MapContext } from "./context/MapContext";
import { mapConfig } from "./constants/mapConfig";
import { LIGHT_THEME, DARK_THEME } from "./constants/colorPalette";

type Props = {
  children: React.ReactNode;
};

const MapRootBase = ({ children }: Props) => {
  const cameraRef = useRef<CameraRef>(null);
  const [floor, setFloor] = useState(mapConfig.default.floor);
  const [zoom, setZoom] = useState(mapConfig.default.zoom);
  const scheme = useColorScheme();

  const colorTheme = useMemo(
    () => (scheme === "dark" ? DARK_THEME : LIGHT_THEME),
    [scheme],
  );

  // startTransition でラップした setFloor — フロア切替を非同期更新にし UI 応答性を維持
  const wrappedSetFloor = useCallback((n: number) => {
    startTransition(() => {
      setFloor(n);
    });
  }, []);

  const moveTo = useCallback(
    (
      center: [number, number],
      nextZoom?: number,
      padding?: { top: number; bottom: number; left: number; right: number },
    ) => {
      cameraRef.current?.setCamera({
        centerCoordinate: center,
        ...(nextZoom !== undefined ? { zoomLevel: nextZoom } : {}),
        animationDuration: 600,
        ...(padding
          ? {
              padding: {
                paddingTop: padding.top,
                paddingBottom: padding.bottom,
                paddingLeft: padding.left,
                paddingRight: padding.right,
              },
            }
          : {}),
      });
    },
    [],
  );

  const flyToSearchResult = useCallback(
    (center: [number, number], zoom = 19.5) => {
      cameraRef.current?.setCamera({
        centerCoordinate: center,
        zoomLevel: zoom,
        animationDuration: 600,
        padding: {
          paddingTop: 100,
          paddingBottom: 220,
          paddingLeft: 60,
          paddingRight: 20,
        },
      });
    },
    [],
  );

  return (
    <MapContext.Provider
      value={{
        cameraRef,
        floor,
        setFloor: wrappedSetFloor,
        zoom,
        setZoom,
        moveTo,
        colorTheme,
        flyToSearchResult,
      }}
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
