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
import { MapIconRegistry } from "../renderers/MapIconRegistry";

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
  return (
    <MapView
      style={styles.container}
      attributionEnabled={false}
      onRegionIsChanging={onRegionIsChanging}
      regionDidChangeDebounceTime={50}
    >
      {/* DD-04: MapIconRegistry moved from MapIconLabel to MapContainer level */}
      <MapIconRegistry />
      <BackgroundLayer
        id="index-back"
        style={{ backgroundColor: "#F6F7F9", backgroundOpacity: 1 }}
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
