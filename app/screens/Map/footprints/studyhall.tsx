import React from "react";
import { StyleSheet, Text, View } from "react-native";

import useLoadGeoJson from "@/hooks/useLoadGeoJson";

import studyhall from '@/assets/imdf/studyhall/footprints/studyhall.geojson';
import { BackgroundLayer, FillLayer, ShapeSource } from "@maplibre/maplibre-react-native";

export default function Studyhall() {
  const { geoJson, loading, error } = useLoadGeoJson(studyhall);

  if (error) {
    console.error(error);
    return (
      <View style={styles.screen}>
        <Text>loading error</Text>
        <Text>please restart this app</Text>
      </View>
    );
  }

  if (loading || !geoJson) return null;

  return (
    <ShapeSource id="studyhall_source" shape={geoJson}>
      <FillLayer
        id="studyhall-fill"
        style={{ fillColor: 'rgba(89, 89, 89, 1)' }}
      />
      <BackgroundLayer
        id="studyhall-back"
        style={{
          visibility: 'none',
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
