import { Images, ShapeSource, SymbolLayer } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

type Props = {
  data: FeatureCollection;
  isVisible: number;
  floor_num: number;
};

export default function Vending({ data, isVisible, floor_num }: Props) {
  return (
    <>
      <Images
        id={`vending_icons-images-${floor_num}`}
        images={{
          vending: require("@/assets/images/icons/imdf_elements/vending/vending-machine.png"),
        }}
      />
      <ShapeSource id={`vending-shape-${floor_num}`} shape={data}>
        <SymbolLayer
          id={`vending-symbol-${floor_num}`}
          filter={["==", ["get", "category"], "vending"]}
          style={{
            iconImage: "vending",
            iconSize: ["interpolate", ["linear"], ["zoom"], 17.9, 0.02, 21.1, 0.13],
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
