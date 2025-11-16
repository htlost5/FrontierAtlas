import {
  CircleLayer,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import Elevator from "./icon_lavel/elevator";
import Toilet from "./icon_lavel/toilet";
import Vending from "./icon_lavel/vending";

type Props = {
  floor_num: number;
  data: FeatureCollection | null;
  display: boolean;
  zoomLevel: number;
};

const pointExcludeList = [
  "stairs",
  "concrete",
  "lobby",
  "launge",
  "opentobelow",
  "restroom.male",
  "restroom.female",
  "restroom.transgender.wheelchair",
  "elevator",
  "vending",
];
const textExcludeList = [
  "stairs",
  "concrete",
  "opentobelow",
  "restroom.male",
  "restroom.female",
  "restroom.transgender.wheelchair",
  "elevator",
  "vending",
];

export default function Symbol({ floor_num, data, display, zoomLevel }: Props) {
  const iconIsVisible = display;
  const isVisible = display;

  if (!data) return null;

  //   display_point→geometryへ設定
  const processedFeatures = data.features.map((f) => ({
    ...f,
    geometry: f.properties?.display_point,
  }));

  const processedGeoJson = {
    ...data,
    features: processedFeatures,
  };

  return (
    <>
      <Toilet data={processedGeoJson} show={iconIsVisible} />
      <Elevator data={processedGeoJson} show={iconIsVisible} />
      <Vending data={processedGeoJson} show={iconIsVisible} />
      <ShapeSource id={`lavel-source-${floor_num}`} shape={processedGeoJson}>
        {/* <CircleLayer
          id="circleLayer"
          filter={["!in", "category", ...pointExcludeList] as any}
          style={{
            circleColor: "#007AFF", // 青色
            circleRadius: 8, // ピクセル単位の半径
            circleStrokeWidth: 2,
            circleStrokeColor: "#ffffff",
            visibility: isVisible ? "visible" : "none",
          }}
        /> */}
        <SymbolLayer
          id="unit-symbol"
          filter={["!in", "category", ...textExcludeList] as any}
          style={{
            symbolPlacement: "point",
            textField: ["get", "ja", ["get", "name"]],
            textSize: [
              "interpolate",
              ["linear"],
              ["zoom"],
              17.9, 3,
              21.1, 25,
            ],
            textFont: ["Noto Sans Regular"],
            visibility: isVisible ? "visible" : "none",
            textAllowOverlap: true,
            iconAllowOverlap: true,
            textIgnorePlacement: true,
          }}
        />
      </ShapeSource>
    </>
  );
}
