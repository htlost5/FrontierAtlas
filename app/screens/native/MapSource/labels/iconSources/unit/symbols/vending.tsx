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

export default function Vending({ data, show }: Props) {
  if (!data) return null;

  return (
    <>
      <Images
        id="vending-icons"
        images={{
          vending: require(`@/assets/images/icons/imdf_elements/vending/vending-machine.png`),
        }}
      />
      <ShapeSource id="vending-source" shape={data}>
        <SymbolLayer
          id="vending-symbol"
          filter={["==", ["get", "category"], "vending"]}
          style={{
            iconImage: "vending",
            iconSize: [
              "interpolate",
              ["linear"],
              ["zoom"],
              17.9, 0.02,
              21.1, 0.13,
            ],
            iconRotationAlignment: "map",
            visibility: show ? "visible" : "none",
            textAllowOverlap: true,
            iconAllowOverlap: true,
            textIgnorePlacement: true,
          }}
        />
      </ShapeSource>
    </>
  );
}
