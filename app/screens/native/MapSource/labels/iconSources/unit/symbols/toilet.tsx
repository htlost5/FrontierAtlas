import {
  Images,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

type Props = {
  data: FeatureCollection;
  show: boolean;
};

export default function Toilet({ data, show }: Props) {
  if (!data) return null;

  return (
    <>
      <Images
        id="toilet-icons"
        images={{
          male: require(`@/assets/images/icons/imdf_elements/toilet/male.png`),
          female: require(`@/assets/images/icons/imdf_elements/toilet/female.png`),
          wheelChair: require(`@/assets/images/icons/imdf_elements/toilet/wheelchair.png`),
        }}
      />
      <ShapeSource id="toilets-source" shape={data}>
        <SymbolLayer
          id="male-toilet"
          filter={["==", ["get", "category"], "restroom.male"]}
          style={{
            iconImage: "male",
            iconSize: [
              "interpolate",
              ["linear"],
              ["zoom"],
              17.9, 0.02,
              21.1, 0.17,
            ],
            iconRotationAlignment: "map",
            visibility: "visible",
            iconAllowOverlap: true,
            textIgnorePlacement: true,
          }}
        />
        <SymbolLayer
          id="female-toilet"
          filter={["==", ["get", "category"], "restroom.female"]}
          style={{
            iconImage: "female",
            iconSize: [
              "interpolate",
              ["linear"],
              ["zoom"],
              17.9, 0.016,
              21.1, 0.14,
            ],
            iconRotationAlignment: "map",
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            visibility: show ? "visible" : "none",
          }}
        />
        <SymbolLayer
          id="wheel-toilet"
          filter={[
            "==",
            ["get", "category"],
            "restroom.transgender.wheelchair",
          ]}
          style={{
            iconImage: "wheelChair",
            iconSize: [
              "interpolate",
              ["linear"],
              ["zoom"],
              17.9, 0.01,
              21.1, 0.09,
            ],
            iconRotationAlignment: "map",
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            visibility: show ? "visible" : "none",
          }}
        />
      </ShapeSource>
    </>
  );
}
