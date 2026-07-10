// トイレ表示コンポーネント: 男性・女性・多機能トイレアイコンをマップ上に表示
// source/labels/iconSources/unit/symbols/toilet.tsx から移植
//
// DD-06: 単一 ShapeSource + 複数 SymbolLayer に集約（重複 ShapeSource を解消）
import {
  Images,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

const SOURCE_ID = "toilet-shape";
const ICON_ID = "toilet_icons-images";

const TOILET_ICONS = {
  male: require("@/assets/images/icons/MapView/MapLogo/toilet/male.png"),
  female: require("@/assets/images/icons/MapView/MapLogo/toilet/female.png"),
  wheelchair: require("@/assets/images/icons/MapView/MapLogo/toilet/wheelchair.png"),
};

type Props = {
  data: FeatureCollection;
  isVisible: number;
};

/**
 * トイレ表示コンポーネント
 * - 男性・女性・多機能トイレのアイコンを表示
 * - 単一 ShapeSource に 3 つの SymbolLayer を重ねる（DD-06）
 */
export function Toilet({ data, isVisible }: Props) {
  const visibility = isVisible ? "visible" : "none";

  return (
    <>
      <Images id={ICON_ID} images={TOILET_ICONS} />
      <ShapeSource id={SOURCE_ID} shape={data}>
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
              0.015,
              21.1,
              0.111,
            ],
            iconRotationAlignment: "map",
            visibility,
            iconAllowOverlap: true,
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
              0.015,
              21.1,
              0.111,
            ],
            iconRotationAlignment: "map",
            visibility,
            iconAllowOverlap: true,
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
              0.015,
              21.1,
              0.111,
            ],
            iconRotationAlignment: "map",
            visibility,
            iconAllowOverlap: true,
          }}
        />
      </ShapeSource>
    </>
  );
}
