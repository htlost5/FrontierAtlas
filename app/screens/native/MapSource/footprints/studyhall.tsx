import React from "react";

import {
  FillLayer,
  LineLayer,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

type Props = {
  data: FeatureCollection | null;
};

export default function Studyhall({ data }: Props) {
  if (!data) return null;

  return (
    <ShapeSource id="studyhall_source" shape={data}>
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
