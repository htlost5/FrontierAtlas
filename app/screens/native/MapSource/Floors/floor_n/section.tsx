import React from "react";

import {
  FillLayer,
  LineLayer,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

type Props = {
  data: FeatureCollection | null;
  floor_num: number;
};

export default function FloorN_section({ data, floor_num }: Props) {
  if (!data) return null;

  return (
    <ShapeSource id={`section-source-${floor_num}`} shape={data}>
      <FillLayer
        id="section-fill"
        style={{
          fillColor: "#FFF5D9",
        }}
      />
      <LineLayer
        id="section-line"
        style={{
          lineColor: "#F0DFAF",
          lineWidth: 1,
        }}
      />
    </ShapeSource>
  );
}
