import React from "react";
import { StyleSheet, Text, View } from "react-native";

import useLoadGeoJson from "@/hooks/useLoadGeoJson";

import interact from '@/assets/imdf/interact/footprints/interact.geojson';
import { FillLayer, LineLayer, ShapeSource } from "@maplibre/maplibre-react-native";

export default function Interact() {
  const { geoJsonList, loading, error } = useLoadGeoJson(interact);

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
    <ShapeSource id="interact_source" shape={geoJsonList[0]}>
      <FillLayer
        id="interact-fill"
        style={{
          fillColor: '#EDEDED',
        }}
      />
      <LineLayer
        id="interact-line"
        style={{
          lineColor: '#CFCFCF',
          lineWidth: 1.5
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
