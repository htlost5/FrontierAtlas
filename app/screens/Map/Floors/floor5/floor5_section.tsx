import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { BackgroundLayer, FillLayer, ShapeSource } from "@maplibre/maplibre-react-native";

import useLoadGeoJson from "@/hooks/useLoadGeoJson";

import section5 from "@/assets/imdf/studyhall/sections/floor5.geojson";

export default function Floor5_section() {
  const { geoJson, loading, error } = useLoadGeoJson(section5);

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
    <ShapeSource id="section-source" shape={geoJson}>
      <FillLayer 
        id="section-fill" 
        style={{
           fillColor: "rgba(204, 0, 255, 0.5)"
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
