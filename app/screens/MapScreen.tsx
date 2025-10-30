// app/(tabs)/index.tsx (Home Screen)
import { StyleSheet } from "react-native";

import {
  BackgroundLayer,
  Camera,
  MapView,
} from "@maplibre/maplibre-react-native";
import FloorN from "./Map/Floors/floor_n/screen";
import Interact from "../screens/Map/footprints/interact";
import Studyhall from "../screens/Map/footprints/studyhall";
import Venue from "../screens/Map/venue";

const restrict_bound = {
  ne: [139.677156, 35.496373],
  sw: [139.679823, 35.499171]
}

type Props = {
  floor_num: number;
};

export default function MapScreen({floor_num}: Props) {
  const num = floor_num;
  return (
    <MapView
      style={[styles.container]}
      mapStyle={{ version: 8, sources: {}, layers: [] }}
    >
      <BackgroundLayer
        id="index-back"
        style={{
          backgroundColor: "#05B0E0",
          backgroundOpacity: 1,
        }}
      />
      <Camera
        zoomLevel={17.2}
        maxZoomLevel={22}
        minZoomLevel={17}
        centerCoordinate={[139.6784895108818, 35.49777179199512]}
        maxBounds={restrict_bound}
        animationDuration={1000}
      />
      <Venue />
      <Interact />
      <Studyhall />
      <FloorN floor_num={num} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
