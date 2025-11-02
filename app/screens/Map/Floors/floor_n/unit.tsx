import React from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  FillLayer,
  LineLayer,
  ShapeSource,
} from "@maplibre/maplibre-react-native";

import useLoadGeoJson from "@/hooks/useLoadGeoJson";

import floor1 from "@/assets/imdf/studyhall/units/floor1.geojson";
import floor2 from "@/assets/imdf/studyhall/units/floor2.geojson";
import floor3 from "@/assets/imdf/studyhall/units/floor3.geojson";
import floor4 from "@/assets/imdf/studyhall/units/floor4.geojson";
import floor5 from "@/assets/imdf/studyhall/units/floor5.geojson";

const unitFiles: Record<number, any> = {
  1: floor1,
  2: floor2,
  3: floor3,
  4: floor4,
  5: floor5,
};

type Props = {
  floor_num: number;
};

export default function FloorN_unit({ floor_num }: Props) {
  const n = floor_num;
  const dataSet = unitFiles[n];

  const { geoJson, loading, error } = useLoadGeoJson(dataSet);

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
    <>
      <ShapeSource id="unit-source" shape={geoJson}>
        <FillLayer
          id="unit-fill"
          style={{
            fillColor: "#C7E6A1",
          }}
        />
        <LineLayer
          id="unit-line"
          style={{
            lineColor: "#9BC06A",
            lineWidth: 1.5,
          }}
        />
      </ShapeSource>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
