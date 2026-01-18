import {
  BackgroundLayer,
  Camera,
  CameraRef,
  MapView,
} from "@maplibre/maplibre-react-native";
import React from "react";
import { StyleSheet } from "react-native";

type Props = {
  cameraRef: React.RefObject<CameraRef | null>;
  onRegionIsChanging?: (region: any) => void;
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
    >
      <BackgroundLayer
        id="index-back"
        style={{ backgroundColor: "#F6F7F9", backgroundOpacity: 1 }}
      />
      <Camera
        ref={cameraRef}
        maxZoomLevel={21.1}
        minZoomLevel={17.2}
        animationDuration={1000}
      />
      {children}
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
