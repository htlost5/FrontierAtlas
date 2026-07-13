// MapView とカメラ設定をラップするコンテナコンポーネント。
import {
  BackgroundLayer,
  Camera,
  CameraRef,
  MapView,
} from "@maplibre/maplibre-react-native";
import type { CameraRegion } from "../hooks/camera/useCameraController/types";
import React from "react";
import { StyleSheet } from "react-native";
import { mapConfig } from "../constants/mapConfig";
import { mapStyle } from "../constants/mapStyle";
import { MapIconRegistry } from "../renderers/MapIconRegistry";
import { useMapContext } from "../hooks/state/useMapContext";

type Props = {
  cameraRef: React.RefObject<CameraRef | null>;
  onRegionIsChanging?: (region: CameraRegion) => void;
  children?: React.ReactNode;
};

export function MapContainer({
  cameraRef,
  onRegionIsChanging,
  children,
}: Props) {
  const { colorTheme } = useMapContext();

  return (
    <MapView
      style={styles.container}
      mapStyle={mapStyle}
      attributionEnabled={false}
      onRegionIsChanging={onRegionIsChanging}
      regionDidChangeDebounceTime={50}
      compassEnabled={true}
      compassViewPosition={1}
      compassViewMargins={{ x: 10, y: 85 }}
    >
      {/* DD-04: MapIconRegistry moved from MapIconLabel to MapContainer level */}
      <MapIconRegistry />
      <BackgroundLayer
        id="index-back"
        style={{ backgroundColor: colorTheme.background, backgroundOpacity: 1 }}
      />
      <Camera
        ref={cameraRef}
        defaultSettings={{
          centerCoordinate: mapConfig.default.center,
          zoomLevel: mapConfig.default.zoom,
        }}
        maxBounds={mapConfig.restrict.bounds}
        maxZoomLevel={mapConfig.zoom.max}
        minZoomLevel={mapConfig.zoom.min}
      />
      {children}
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
