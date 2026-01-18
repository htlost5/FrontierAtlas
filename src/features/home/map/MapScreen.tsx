import { FloorView } from "@/source/views/floor/floorN";
import { Venue } from "@/source/views/ground/ground";
import { AppInitContext } from "@/src/AppInit/AppInitContext";
import type { CameraRef } from "@maplibre/maplibre-react-native";
import React, { useCallback, useContext, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { MapContainer } from "./components/MapContainer";
import { useDisplayLevel } from "./hooks/useDisplayLevel";
import { useMapCamera } from "./hooks/useMapCamera";
import { useMapGeoData } from "./hooks/useMapGeoData";

type Props = {
  floor_num: number;
  cameraRef: React.RefObject<CameraRef | null>;
};

export function MapScreen({ floor_num, cameraRef }: Props) {
  const { cacheReady } = useContext(AppInitContext);
  const { venueGeoData, floorGeoData, venueLoading, floorLoading } =
    useMapGeoData(floor_num);

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

  if (venueLoading || floorLoading || !cacheReady) {
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
  return (
    <MapContainer
      cameraRef={cameraRef}
      onRegionIsChanging={handleRegionIsChanging}
    >
      {venueGeoData?.venue && <Venue data={venueGeoData.venue} />}
      {venueGeoData?.studyhall && <Venue data={venueGeoData.studyhall} />}
      {venueGeoData?.interact && <Venue data={venueGeoData.interact} />}
      {floorGeoData &&
        floorGeoData.unit &&
        floorGeoData.section &&
        floorGeoData.stair && (
          <FloorView
            floor_num={floor_num}
            geoData={floorGeoData}
            display={display}
            zoomLevel={zoom}
          />
        )}
    </MapContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
