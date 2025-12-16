import {
  FillLayer,
  LineLayer,
  SymbolLayer,
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
      <FillLayer
        id="studyhall-fill"
        style={{
          fillColor: "#EDEDED",
          fillOpacity: 0,
        }}
      />
      <LineLayer
        id="studyhall-line"
        style={{
          lineColor: "#CFCFCF",
          lineWidth: 1.5,
          lineOpacity: 0,
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
          visibility: "none",
        }}
      />
    </ShapeSource>
  );
}
