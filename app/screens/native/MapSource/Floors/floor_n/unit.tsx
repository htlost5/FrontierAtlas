import React from "react";

import {
  FillLayer,
  LineLayer,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

type Props = {
  data: FeatureCollection | null;
  stairData: FeatureCollection | null;
  floor_num: number;
  display: boolean;
};

const excludeList = ["stairs", "concrete", "lobby", "launge", "opentobelow", "courtyard", "terrace"]

export default function FloorN_unit({ data, stairData, floor_num, display }: Props) {  
  if (!data || !stairData) return null;

  return (
    <>
      <ShapeSource id={`unit-source-${floor_num}`} shape={data}>
        <FillLayer
          id="unit-fill"
          filter={["!in", "category", ...excludeList] as any}
          style={{
            fillColor: "#C7E6A1",
            visibility: display ? "visible" : "none"
          }}
        />
        <LineLayer
          id="unit-line"
          filter={["!in", "category", ...excludeList] as any}
          style={{
            lineColor: "#9BC06A",
            lineWidth: 1.5,
            visibility: display ? "visible" : "none"
          }}
        />
      </ShapeSource>
      <ShapeSource id={`wall-source-${floor_num}`} shape={data}>
        <FillLayer
          id="wall-fill"
          filter={["==", ["get", "category"], "concrete"]}
          style={{
            fillColor: "#B0B0B0",
            visibility: display ? "visible" : "none"
          }}
        />
        <LineLayer
          id="wall-line"
          filter={["==", ["get", "category"], "concrete"]}
          style={{
            lineColor: "rgba(0,0,0,0.2)",
            lineOpacity: 1.5,
            visibility: display ? "visible" : "none"
          }}
        />
      </ShapeSource>
      <ShapeSource id={`open-source-${floor_num}`} shape={data}>
        <LineLayer
          id="open-line"
          filter={["==", ["get", "category"], "opentobelow"]}
          style={{
            lineColor: "rgba(0,0,0,0.2)",
            lineOpacity: 1.5,
            visibility: display ? "visible" : "none"
          }}
        />
      </ShapeSource>
      <ShapeSource id={`terrace-source-${floor_num}`} shape={data}>
        <LineLayer
          id="terrace-line"
          filter={["==", ["get", "category"], "terrace"]}
          style={{
            lineColor: "rgba(0,0,0,0.2)",
            lineOpacity: 1.5,
            visibility: display ? "visible" : "none"
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
            visibility: display ? "visible" : "none"
          }}
        />
      </ShapeSource>
    </>
  );
}
