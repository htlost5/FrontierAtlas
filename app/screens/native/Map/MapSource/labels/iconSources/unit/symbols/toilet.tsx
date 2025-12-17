import {
  Images,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

type Props = {
  data: FeatureCollection;
  isVisible: number;
  floor_num: number;
};

export default function Toilet({ data, isVisible, floor_num }: Props) {
  return (
    <>
      <Images
        id={`toilet_icons-images-${floor_num}`}
        images={{
          male: require("@/assets/images/icons/MapView/imdf_elements/toilet/male.png"),
          female: require("@/assets/images/icons/MapView/imdf_elements/toilet/female.png"),
          wheelchair: require("@/assets/images/icons/MapView/imdf_elements/toilet/wheelchair.png"),
        }}
      />
      <ShapeSource id={`toilet-shape-${floor_num}`} shape={data}>
        <SymbolLayer
          id={`male-symbol-${floor_num}`}
          filter={["==", ["get", "category"], "restroom.male"]}
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
          id={`female-symbol-${floor_num}`}
          filter={["==", ["get", "category"], "restroom.female"]}
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
          id={`wheelChair-symbol-${floor_num}`}
          filter={[
            "==",
            ["get", "category"],
            "restroom.transgender.wheelchair",
          ]}
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
