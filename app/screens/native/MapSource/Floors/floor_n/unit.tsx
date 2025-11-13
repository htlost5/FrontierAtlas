import React from "react";

import {
  CircleLayer,
  FillLayer,
  LineLayer,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

type Props = {
  data: FeatureCollection | null;
  stairData: FeatureCollection | null;
  floor_num: number;
};

export default function FloorN_unit({ data, stairData, floor_num }: Props) {
  if (!data || !stairData) return null;

  // const processedFeatures = data.features.map((f) => ({
  //   ...f,
  //   geometry: f.properties?.display_point,
  // }));

  // const processedGeoJson = {
  //   ...data,
  //   features: processedFeatures,
  // };

  return (
    <>
      <ShapeSource id={`unit-source-${floor_num}`} shape={data}>
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
        {/* <CircleLayer
          id="circleLayer"
          style={{
            circleColor: "#007AFF", // 青色
            circleRadius: 8, // ピクセル単位の半径
            circleStrokeWidth: 2,
            circleStrokeColor: "#ffffff",
          }}
        /> */}
        <SymbolLayer
          id="unit-symbol"
          style={{
            symbolPlacement: "point",
            textField: ["get", "ja", ["get", "name"]],
            textSize: 20,
          }}
        />
      </ShapeSource>
      <ShapeSource id={`stairs-source-${floor_num}`} shape={stairData}>
        <LineLayer
          id="stairs-line"
          filter={
            floor_num === 4 || floor_num === 5
              ? ["==", ["get", "category"], "4-5"]
              : ["all"]
          }
          style={{
            lineColor: [
              "case",
              ["==", ["get", "alt_name"], "wall"],
              "#9BC06A",
              "#FFAE00",
            ],
            lineWidth: ["case", ["==", ["get", "restriction"], "1"], 3, 1.5],
          }}
        />
      </ShapeSource>
    </>
  );
}
