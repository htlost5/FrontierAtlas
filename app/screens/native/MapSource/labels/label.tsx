import { exclude } from "@/settings/label/excludeList";
import {
  Images,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import UnitSymbol from "./iconSources/unit/unit-label";

type Props = {
  floor_num: number;
  data: FeatureCollection | null;
  display: number;
};

export default function LabelView({ floor_num, data, display }: Props) {
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

  const isVisible = display;

  return (
    <>
      <Images
        id="map-symbols"
        images={{
          room: require("@/assets/images/icons/map/room.png"),
        }}
      />

      {/* マップ上 部屋アイコン表示 */}
      <ShapeSource
        id={`lavel-source-icon-${floor_num}`}
        shape={processedGeoJson}
      >
        <SymbolLayer
          id="room"
          filter={["!in", "category", ...exclude.floor.POINT] as any}
          style={{
            symbolPlacement: "point",
            iconImage: "room",
            iconSize: [
              "interpolate",
              ["linear"],
              ["zoom"],
              17, 0.035,
              19, 0.045,
              21, 0.055,
            ],
            iconRotationAlignment: "viewport",
            visibility: isVisible ? "visible" : "none",
            iconAllowOverlap: false,
            textIgnorePlacement: false,
          }}
        />
      </ShapeSource>

      {/* マップ上 テキスト表示 */}
      <ShapeSource
        id={`lavel-source-text-${floor_num}`}
        shape={processedGeoJson}
      >
        {/* アイコンありテキスト表示 */}
        <SymbolLayer
          id="unit-symbol-text-point"
          filter={
            [
              "all",
              ["!in", "category", ...exclude.floor.TEXT],
              ["!in", "category", ...exclude.floor.POINT],
            ] as any
          }
          style={{
            symbolPlacement: "point",
            textField: ["get", "ja", ["get", "name"]],
            textSize: [
              "interpolate",
              ["linear"],
              ["zoom"],
              17, 10,
              19, 12,
              21, 14,
            ],
            textFont: ["Noto Sans Regular"],
            visibility: isVisible ? "visible" : "none",
            textAllowOverlap: false,
            textIgnorePlacement: false,
            textAnchor: "left",
            textOffset: [1.4, 0],
          }}
        />

        {/* アイコンなしテキスト表示 */}
        <SymbolLayer
          id="unit-symbol-text"
          filter={
            [
              "all",
              ["!in", "category", ...exclude.floor.TEXT],
              ["in", "category", ...exclude.floor.POINT],
            ] as any
          }
          style={{
            symbolPlacement: "point",
            textField: ["get", "ja", ["get", "name"]],
            textSize: [
              "interpolate",
              ["linear"],
              ["zoom"],
              17, 10,
              19, 12,
              21, 14,
            ],
            textFont: ["Noto Sans Regular"],
            visibility: isVisible === 2 ? "visible" : "none",
            textAllowOverlap: false,
            textIgnorePlacement: false,
          }}
        />
      </ShapeSource>

      {/* マップ上アイコン表示 */}
      <UnitSymbol
        pointData={processedGeoJson}
        isVisible={isVisible}
        floor_num={floor_num}
      />
    </>
  );
}
