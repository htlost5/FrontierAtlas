import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { FillLayer, ShapeSource } from "@maplibre/maplibre-react-native";

import useLoadGeoJson from "@/hooks/useLoadGeoJson";

import unit5 from "@/assets/imdf/studyhall/units/floor5.geojson";

export default function Floor5_unit() {
  const { geoJson, loading, error } = useLoadGeoJson(unit5);

  if (error) {
    console.error(error);
    return (
      <View style={styles.screen}>
        <Text>loading error</Text>
        <Text>please restart this app</Text>
      </View>
    );
  }

  if (loading || !geoJson) {
    return null;
  }

  return (
    <ShapeSource id="unit-source" shape={geoJson}>
      <FillLayer
        id="unit-fill"
        style={{
          fillColor: "rgba(0, 0, 255, 0.5)",
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
