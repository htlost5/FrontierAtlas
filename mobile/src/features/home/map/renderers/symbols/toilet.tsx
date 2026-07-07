// トイレ表示コンポーネント: 男性・女性・多機能トイレアイコンをマップ上に表示
// source/labels/iconSources/unit/symbols/toilet.tsx から移植
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
 * トイレ表示コンポーネント
 * - 男性・女性・多機能トイレのアイコンを表示
 */
export function Toilet({ data, isVisible }: Props) {
  return (
    <>
      <Images
        id="toilet_icons-images"
        images={{
          male: require("@/assets/images/icons/MapView/MapLogo/toilet/male.png"),
          female: require("@/assets/images/icons/MapView/MapLogo/toilet/female.png"),
          wheelchair: require("@/assets/images/icons/MapView/MapLogo/toilet/wheelchair.png"),
        }}
      />
      <ShapeSource id="toilet-shape" shape={data}>
        <SymbolLayer
          id="male-symbol"
          filter={["==", ["get", "category"], "restroom_male"]}
          style={{
            iconImage: "male",
            iconSize: [
              "interpolate",
              ["linear"],
              ["zoom"],
              17.9,
              0.02,
              21.1,
              0.17,
            ],
            iconRotationAlignment: "map",
            visibility: isVisible ? "visible" : "none",
            iconAllowOverlap: true,
            textIgnorePlacement: true,
          }}
        />
        <SymbolLayer
          id="female-symbol"
          filter={["==", ["get", "category"], "restroom_female"]}
          style={{
            iconImage: "female",
            iconSize: [
              "interpolate",
              ["linear"],
              ["zoom"],
              17.9,
              0.016,
              21.1,
              0.14,
            ],
            iconRotationAlignment: "map",
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            visibility: isVisible ? "visible" : "none",
          }}
        />
        <SymbolLayer
          id="wheelChair-symbol"
          filter={["==", ["get", "category"], "restroom_accessible"]}
          style={{
            iconImage: "wheelchair",
            iconSize: [
              "interpolate",
              ["linear"],
              ["zoom"],
              17.9,
              0.01,
              21.1,
              0.09,
            ],
            iconRotationAlignment: "map",
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            visibility: isVisible ? "visible" : "none",
          }}
        />
      </ShapeSource>
    </>
  );
}
