// app/(tabs)/index.tsx
import {
  BackgroundLayer,
  Camera,
  CameraRef,
  MapView,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import loadGeoJson from "@/functions/loadGeoJson";

import FloorN from "./MapSource/Floors/floor_n/screen";
import Interact from "./MapSource/footprints/interact";
import Studyhall from "./MapSource/footprints/studyhall";
import Venue from "./MapSource/venue";

type MapScreenProps = {
  floor_num: number;
  cameraRef: React.RefObject<CameraRef | null>;
};

type GeoData = {
  venue: FeatureCollection;
  studyhall: FeatureCollection;
  interact: FeatureCollection;
}

const restrict_bound = {
  ne: [139.677156, 35.496373],
  sw: [139.679823, 35.499171],
};

export default function MapScreenNative({ floor_num, cameraRef }: MapScreenProps) {
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [venue, studyhall, interact] = await loadGeoJson([
          {type: 'venue', feature: 'venue'},
          {type: 'studyhall', feature: 'studyhall'},
          {type: 'interact', feature: 'interact'}
        ]);

        setGeoData({ venue, studyhall, interact });
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
      {geoData?.venue && <Venue data={geoData.venue} />}
      {geoData?.studyhall && <Studyhall data={geoData.studyhall} />}
      {geoData?.interact && <Interact data={geoData.interact} />}
      <FloorN floor_num={floor_num} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
