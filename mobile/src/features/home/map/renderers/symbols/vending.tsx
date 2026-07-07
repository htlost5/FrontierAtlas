// 自販機表示コンポーネント: 自販機アイコンをマップ上に表示
// source/labels/iconSources/unit/symbols/vending.tsx から移植
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
 * 自販機表示コンポーネント
 * - 自販機アイコンをズームレベルに応じたサイズで表示
 */
export function Vending({ data, isVisible }: Props) {
  return (
    <>
      <Images
        id="vending_icons-images"
        images={{
          vending: require("@/assets/images/icons/MapView/MapLogo/vending/vending-machine.png"),
        }}
      />
      <ShapeSource id="vending-shape" shape={data}>
        <SymbolLayer
          id="vending-symbol"
          filter={["==", ["get", "category"], "vending_area"]}
          style={{
            iconImage: "vending",
            iconSize: [
              "interpolate",
              ["linear"],
              ["zoom"],
              17.9,
              0.02,
              21.1,
              0.13,
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
