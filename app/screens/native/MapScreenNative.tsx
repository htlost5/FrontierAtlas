// app/(tabs)/index.tsx
import {
  BackgroundLayer,
  Camera,
  CameraRef,
  MapView,
} from "@maplibre/maplibre-react-native";
import * as FileSystem from "expo-file-system";
import type { FeatureCollection } from "geojson";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import parseGeoJsonAsync from "@/functions/jsonParse";

import FloorN from "./MapSource/Floors/floor_n/screen";
import Interact from "./MapSource/footprints/interact";
import Studyhall from "./MapSource/footprints/studyhall";
import Venue from "./MapSource/venue";

type MapScreenProps = {
  floor_num: number;
  cameraRef: React.RefObject<CameraRef | null>;
};

const restrict_bound = {
  ne: [139.677156, 35.496373],
  sw: [139.679823, 35.499171],
};

export default function MapScreenNative({
  floor_num,
  cameraRef,
}: MapScreenProps) {
  const [parsedData, setParsedData] = useState<{
    venue?: FeatureCollection;
    studyhall?: FeatureCollection;
    interact?: FeatureCollection;
  }>({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const cacheDir = `${FileSystem.documentDirectory}geoJson_cache/venues`;

        const [venueTxt, studyhallTxt, interactTxt] = await Promise.all([
          FileSystem.readAsStringAsync(`${cacheDir}/venue.geojson`),
          FileSystem.readAsStringAsync(`${cacheDir}/studyhall.geojson`),
          FileSystem.readAsStringAsync(`${cacheDir}/interact.geojson`),
        ]);

        const [venue, studyhall, interact] = await Promise.all([
          parseGeoJsonAsync(venueTxt),
          parseGeoJsonAsync(studyhallTxt),
          parseGeoJsonAsync(interactTxt),
        ]);

        setParsedData({ venue, studyhall, interact });
      } catch (e) {
        console.error("Failed to load GeoJSON:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <MapView style={styles.container}>
      <BackgroundLayer
        id="index-back"
        style={{
          backgroundColor: "#F6F7F9",
          backgroundOpacity: 1,
        }}
      />
      <Camera
        zoomLevel={17.2}
        maxZoomLevel={22}
        minZoomLevel={17}
        ref={cameraRef}
        centerCoordinate={[139.6784895108818, 35.49777179199512]}
        maxBounds={restrict_bound}
        animationDuration={1000}
      />
      {parsedData.venue && <Venue data={parsedData.venue} />}
      {parsedData.studyhall && <Studyhall data={parsedData.studyhall} />}
      {parsedData.interact && <Interact data={parsedData.interact} />}
      <FloorN floor_num={floor_num} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
