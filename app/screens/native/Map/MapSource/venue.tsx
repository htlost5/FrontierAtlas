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

export default function Venue({ data }: Props) {
  if (!data) return null;

  return (
    <ShapeSource id="venue_source" shape={data}>
      <FillLayer
        id="venue-fill"
        style={{
          fillColor: "#E8F0FF",
        }}
      />
      <LineLayer
        id="venue-line"
        style={{
          lineColor: "#B8D1FF",
          lineWidth: 1,
        }}
      />
    </ShapeSource>
  );
}
