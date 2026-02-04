import { FloorView } from "@/source/views/floor/floorN";
import { Venue } from "@/source/views/ground/ground";
import { AppInitContext } from "@/src/AppInit/AppInitContext";
import type { CameraRef } from "@maplibre/maplibre-react-native";
import React, { useCallback, useContext, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { MapContainer } from "./components/MapContainer";
import { useFloorGeoData } from "./hooks/dataLoad/useFloorGeoData";
import { useMapGeoData } from "./hooks/dataLoad/useMapGeoData";
import { useDisplayLevel } from "./hooks/useDisplayLevel";
import { useMapCamera } from "./hooks/useMapCamera";

type Props = {
  floor_num: number;
  cameraRef: React.RefObject<CameraRef | null>;
};

export function MapScreen({ floor_num, cameraRef }: Props) {
  const { cacheReady } = useContext(AppInitContext);
  const { venue, studyhall, interact, mapLoading, mapError } = useMapGeoData();
  const { floorGeoData, floorLoading, floorError } = useFloorGeoData(floor_num);

  const [zoom, setZoom] = useState(17.2);
  const display = useDisplayLevel(zoom);

  useMapCamera(cameraRef);

  const handleRegionIsChanging = useCallback(
    (region: any) => {
      const currentZoom = region.properties?.zoomLevel ?? zoom;
      setZoom(currentZoom);
    },
    [zoom],
  );

  if (mapLoading || floorLoading || !cacheReady) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size={"large"} color={"#007AFF"} />
      </View>
    );
  }

  if (!venue || !studyhall || !interact) return null;
  if (
    !floorGeoData ||
    !floorGeoData.units ||
    !floorGeoData.sections ||
    !floorGeoData.stairs
  )
    return null;

  const floorViewGeoData = {
    unit: floorGeoData.units,
    section: floorGeoData.sections,
    stair: floorGeoData.stairs,
  };

  return (
    <MapContainer
      cameraRef={cameraRef}
      onRegionIsChanging={handleRegionIsChanging}
    >
      <Venue data={venue} />
      <Venue data={studyhall} />
      <Venue data={interact} />
      <FloorView
        floor_num={floor_num}
        geoData={floorViewGeoData}
        display={display}
        zoomLevel={zoom}
      />
    </MapContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
