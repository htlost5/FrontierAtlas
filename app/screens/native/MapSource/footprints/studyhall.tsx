import {
  FillLayer,
  LineLayer,
  SymbolLayer,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import React, { useEffect, useState } from "react";

type Props = {
  floor_num: number;
  data: FeatureCollection | null;
  display: boolean;
};

export default function Studyhall({ floor_num, data, display }: Props) {
  const [clear, setClear] = useState(false);

  useEffect(() => {
    if (!(floor_num === 4 || floor_num === 5) && display) {
      setClear(true);
    } else {
      setClear(false);
    }
  }, [floor_num, display]);

  if (!data) return null;

  return (
    <ShapeSource id="studyhall_source" shape={data}>
      <FillLayer
        id="studyhall-fill"
        style={{
          fillColor: "#EDEDED",
          fillOpacity: clear ? 0 : 1,
        }}
      />
      <LineLayer
        id="studyhall-line"
        style={{
          lineColor: "#CFCFCF",
          lineWidth: 1.5,
          lineOpacity: clear ? 0 : 1,
        }}
      />
      <SymbolLayer
        id="studyhall-symbol"
        style={{
          textField: "学習棟",
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
          visibility: display ? "none" : "visible",
        }}
      />
    </ShapeSource>
  );
}
