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

export default function Elevator({ data, show }: Props) {
  if (!data) return null;

  return (
    <>
      <Images
        id="elevator-icons"
        images={{
          elevator: require(`@/assets/images/icons/imdf_elements/elevator/elevator.png`),
        }}
      />
      <ShapeSource id="elevator-source" shape={data}>
        <SymbolLayer
          id="elevator-symbol"
          filter={["==", ["get", "category"], "elevator"]}
          style={{
            iconImage: "elevator",
            iconSize: [
              "interpolate",
              ["linear"],
              ["zoom"],
              17.9, 0.016,
              21.1, 0.11,
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
