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

export default function Elevator({ data, isVisible, floor_num }: Props) {
  return (
    <>
      <Images
        id={`elevator_icons-images-${floor_num}`}
        images={{
          elevator: require("@/assets/images/icons/MapView/MapLogo/elevator/elevator.png"),
        }}
      />
      <ShapeSource id={`elevator-symbol-${floor_num}`} shape={data}>
        <SymbolLayer
          id={`elevator-symbol-${floor_num}`}
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
