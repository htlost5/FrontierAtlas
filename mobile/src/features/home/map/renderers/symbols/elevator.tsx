// エレベーター表示コンポーネント: エレベーターアイコンをマップ上に表示
// source/labels/iconSources/unit/symbols/elevator.tsx から移植
import {
  Images,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

type Props = {
  data: FeatureCollection;
  isVisible: number;
};

/**
 * エレベーター表示コンポーネント
 * - エレベーターアイコンをズームレベルに応じたサイズで表示
 */
export function Elevator({ data, isVisible }: Props) {
  return (
    <>
      <Images
        id="elevator_icons-images"
        images={{
          elevator: require("@/assets/images/icons/MapView/MapLogo/elevator/elevator.png"),
        }}
      />
      <ShapeSource id="elevator-symbol" shape={data}>
        <SymbolLayer
          id="elevator-symbol"
          filter={["==", ["get", "category"], "elevator"]}
          style={{
            iconImage: "elevator",
            iconSize: [
              "interpolate",
              ["linear"],
              ["zoom"],
              17.9,
              0.016,
              21.1,
              0.11,
            ],
            iconRotationAlignment: "map",
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
