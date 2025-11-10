import React from "react";
import { StyleSheet, Text, View } from "react-native";

import useLoadGeoJson from "@/hooks/useLoadGeoJson";

import venue from "@/assets/imdf/venue.geojson";
import { FillLayer, LineLayer, ShapeSource } from "@maplibre/maplibre-react-native";

export default function Venue() {
  const { geoJsonList, loading, error } = useLoadGeoJson(venue);

  if (error) {
    console.error(error);
    return (
      <View style={styles.screen}>
        <Text>loading error</Text>
        <Text>please restart this app</Text>
      </View>
    );
  }

  if (loading || !geoJsonList) return null;

  return (
    <ShapeSource id="venue_source" shape={geoJsonList[0]}>
      <FillLayer
        id="venue-fill"
        style={{
          fillColor: "#E8F0FF",
        }}
      />
      <LineLayer
        id="venue-line"
        style={{
          lineColor: "#B8D1FF",
          lineWidth: 1,
        }}
      />
    </ShapeSource>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
