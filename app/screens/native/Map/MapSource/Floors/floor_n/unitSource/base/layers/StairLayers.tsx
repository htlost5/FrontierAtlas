import { LineLayer, ShapeSource } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

type Props = {
  data: FeatureCollection;
  floor_num: number;
};

export default function StairLayers({ data, floor_num }: Props) {
  return (
    <ShapeSource id={`stairLayers-source-${floor_num}`} shape={data}>
      <LineLayer
        id={`stairs-line-${floor_num}`}
        filter={
          floor_num === 4 || floor_num === 5
            ? ["==", ["get", "category"], "4-5"]
            : ["all"]
        }
        style={{
          lineColor: [
            "case",
            ["==", ["get", "alt_name"], "wall"],
            "#A8B996",
            "#FFAE00",
          ],
          lineWidth: ["case", ["==", ["get", "restriction"], "1"], 3, 1.5],
          visibility: "visible",
          // visibility: display ? "visible" : "none",
        }}
      />
    </ShapeSource>
  );
}
