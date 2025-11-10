// app/(tabs)/index.tsx (Home Screen)
import { StyleSheet } from "react-native";

import {
  BackgroundLayer,
  Camera,
  CameraRef,
  MapView,
} from "@maplibre/maplibre-react-native";
import Interact from "./MapSource/footprints/interact";
import Studyhall from "./MapSource/footprints/studyhall";
import Venue from "./MapSource/venue";
import FloorN from "./MapSource/Floors/floor_n/screen";

type MapScreenProps = {
  floor_num: number;
  cameraRef: React.RefObject<CameraRef | null>;
};

const restrict_bound = {
  ne: [139.677156, 35.496373],
  sw: [139.679823, 35.499171],
};

export default function MapScreenWeb({ floor_num, cameraRef }: MapScreenProps) {
  console.log("web");
  return (
    <MapView
      style={[styles.container]}
      mapStyle="https://api.maptiler.com/maps/jp-mierune-streets/style.json?key=Hg57EtvIfNmVzkBRxAoV"
    >
      <BackgroundLayer
        id="index-back"
        style={{
          backgroundColor: "#F6F7F9",
          backgroundOpacity: 1,
        }}
      />
      <Camera
        zoomLevel={17.2}
        maxZoomLevel={22}
        minZoomLevel={17}
        ref={cameraRef}
        centerCoordinate={[139.6784895108818, 35.49777179199512]}
        maxBounds={restrict_bound}
        animationDuration={1000}
      />
      <Venue />
      <Interact />
      <Studyhall />
      <FloorN floor_num={floor_num} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
