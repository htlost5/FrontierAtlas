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

import stairs from "@/assets/imdf/studyhall/units/study_stairs.geojson";

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
  const dataSet = unitFiles[floor_num];
  const stairsSet = stairs;

  const { geoJsonList, loading, error } = useLoadGeoJson(dataSet, stairsSet);

  if (error) {
    console.error(error);
    return (
      <View style={styles.screen}>
        <Text>loading error</Text>
        <Text>please restart this app</Text>
      </View>
    );
  }

  if (loading || !geoJsonList) {
    return null;
  }

  return (
    <>
      <ShapeSource id="unit-source" shape={geoJsonList[0]}>
        <FillLayer
          id="unit-fill"
          filter={["!=", ["get", "category"], "stairs"]}
          style={{
            fillColor: "#C7E6A1",
          }}
        />
        <LineLayer
          id="unit-line"
          filter={["!=", ["get", "category"], "stairs"]}
          style={{
            lineColor: "#9BC06A",
            lineWidth: 1.5,
          }}
        />
      </ShapeSource>
      <ShapeSource id="stairs-source" shape={geoJsonList[1]}>
        <LineLayer
          id="stairs-line"
          filter={(floor_num === 4 || floor_num === 5) ? ["==", ["get", "category"], "4-5"] : ["all"]}
          style={{
            lineColor: [
              "case",
              ["==", ["get", "alt_name"], "wall"],
              "#9BC06A",
              "#FFAE00"
            ],
            lineWidth: [
              "case",
              ["==", ["get", "restriction"], "1"],
              3,
              1.5
            ],
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
