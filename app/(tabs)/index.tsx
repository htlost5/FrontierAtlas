// app/(tabs)/index.tsx (Home Screen)
import { CameraRef } from "@maplibre/maplibre-react-native";
import React, { useRef, useState } from "react";
import { StyleSheet, View, Platform } from "react-native";

import FloorChange from "@/components/MapComponents/FloorChange";
import UserLocation from "@/components/MapComponents/userLocation";

import MapScreenNative from "../screens/native/MapScreenNative";
import MapScreenWeb from "../screens/web/MapScreenWeb";

const MapScreen = Platform.OS === "android" || Platform.OS === "ios"
  ? MapScreenNative
  : MapScreenWeb

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
