import {
  Camera,
  FillLayer,
  MapView,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import React, { useEffect, useState } from "react";

import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import type { FeatureCollection } from "geojson";
import { StyleSheet, Text, View } from "react-native";

export default function Floor5() {
  const [unitGeoJson, setUnitGeoJson] = useState<FeatureCollection | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGeo() {
      try {
        const asset = Asset.fromModule(
          require("../../../../IMDF/unit.geojson")
        );
        await asset.downloadAsync(); // アセット取得
        const text = await FileSystem.readAsStringAsync(asset.localUri!);
        const geojson = JSON.parse(text) as FeatureCollection;
        // ←ここで読み込み確認
        console.log("GeoJSON loaded successfully!");
        console.log("FeatureCollection type:", geojson.type);
        console.log("Number of features:", geojson.features.length);
        console.log("First feature:", geojson.features[0]);
        setUnitGeoJson(geojson);
      } catch (e) {
        console.error("Failed to load GeoJSON", e);
      } finally {
        setLoading(false);
      }
    }
    loadGeo();
  }, []);

  if (loading || !unitGeoJson) {
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
      <ShapeSource id="unit-source" shape={unitGeoJson}>
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
