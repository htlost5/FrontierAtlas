// app/(tabs)/index.tsx (Home Screen)
import { CameraRef } from "@maplibre/maplibre-react-native";
import React, { useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

import FloorChange from "@/components/MapUI/interface/FloorChange";
import UserLocation from "@/components/MapUI/interface/userLocation";

import MapScreenNative from "../../screens/native/Map/MapScreenNative";
import MapScreenWeb from "../../screens/web/MapScreenWeb";

const MapScreen =
  Platform.OS === "android" || Platform.OS === "ios"
    ? MapScreenNative
    : MapScreenWeb;

export default function HomeScreen() {
  const [num, setNum] = useState(1);
  const cameraRef = useRef<CameraRef>(null);

  return (
    <View style={styles.container}>
      <MapScreen floor_num={num} cameraRef={cameraRef} />
      <FloorChange num={num} setNum={setNum} />
      <UserLocation cameraRef={cameraRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
