// app/(tabs)/index.tsx (Home Screen)
import { StyleSheet } from "react-native";

import {
  BackgroundLayer,
  Camera,
  MapView,
} from "@maplibre/maplibre-react-native";
import Floor5 from "../screens/Map/Floors/floor5/Floor5";
import Interact from "../screens/Map/footprints/interact";
import Studyhall from "../screens/Map/footprints/studyhall";
import Venue from "../screens/Map/venue";

export default function MapScreen() {
  console.log(Floor5);
  console.log(Venue);
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
        zoomLevel={17}
        centerCoordinate={[139.6784895108818, 35.49777179199512]}
      />
      <Venue />
      <Interact />
      <Studyhall />
      <Floor5 />
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
