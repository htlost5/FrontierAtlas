import React from "react";
import { StyleSheet, Text, View } from "react-native";

import useLoadGeoJson from "@/hooks/useLoadGeoJson";

import studyhall from "@/assets/imdf/studyhall/footprints/studyhall.geojson";
import { FillLayer, LineLayer, ShapeSource } from "@maplibre/maplibre-react-native";

export default function Studyhall() {
  const { geoJsonList, loading, error } = useLoadGeoJson(studyhall);

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
    <ShapeSource id="studyhall_source" shape={geoJsonList[0]}>
      <FillLayer id="studyhall-fill" style={{ fillColor: "#EDEDED" }} />
      <LineLayer
        id="studyhall-line"
        style={{
          lineColor: "#CFCFCF",
          lineWidth: 1.5,
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
