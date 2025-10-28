import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Camera, FillLayer, MapView, ShapeSource } from "@maplibre/maplibre-react-native";

import useLoadGeoJson from "@/hooks/useLoadGeoJson";

import floor5 from "@/assets/imdf/studyhall/units/floor5.geojson";

export default function Floor5() {
  const { geoJson, loading, error } = useLoadGeoJson(floor5);

  if (error) {
    console.error(error);
  }

  if (loading || !geoJson) {
    return (
      <View
        style={[
          styles.screen,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Loading GeoJSON...</Text>
      </View>
    );
  }

  return (
    <MapView style={styles.screen}>
      <Camera
        zoomLevel={15}
        centerCoordinate={[139.6783918676534, 35.49843071028419]}
      />
      <ShapeSource id="unit-source" shape={geoJson}>
        <FillLayer
          id="unit-fill"
          style={{ fillColor: "rgba(0, 0, 255, 0.5)" }}
        />
      </ShapeSource>
    </MapView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
