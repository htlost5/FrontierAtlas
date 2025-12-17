import React from "react";

import {
  FillLayer,
  LineLayer,
  ShapeSource,
  SymbolLayer,
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
      <SymbolLayer
        id="interact-symbol"
        style={{
          textField: "交流棟",
          textSize: [
            "interpolate", 
            ["linear"], ["zoom"], 
            17.2, 12,
            21.1, 20
          ],
          textAllowOverlap: true, // 他のラベルやアイコンと重なっても表示
          textIgnorePlacement: true,
          textColor: "#000000",
          textFont: ["Noto Sans Regular"],
        }}
      />
    </ShapeSource>
  );
}
