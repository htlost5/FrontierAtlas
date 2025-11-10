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

export default function Interact({ data }: Props) {
  if (!data) return null;

  return (
    <ShapeSource id="interact_source" shape={data}>
      <FillLayer
        id="interact-fill"
        style={{
          fillColor: "#EDEDED",
        }}
      />
      <LineLayer
        id="interact-line"
        style={{
          lineColor: "#CFCFCF",
          lineWidth: 1.5,
        }}
      />
    </ShapeSource>
  );
}
