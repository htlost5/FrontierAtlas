// app/(tabs)/index.tsx (Home Screen)
import { CameraRef } from "@maplibre/maplibre-react-native";
import React, { useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

import FloorChange from "@/components/MapComponents/FloorChange";
import UserLocation from "@/components/MapComponents/userLocation";

import SearchBar from "@/components/MapComponents/searchBar";
import MapScreenNative from "../screens/native/Map/MapScreenNative";
import MapScreenWeb from "../screens/web/MapScreenWeb";
import SearchView from "../screens/native/searchView/searchView";

const MapScreen =
  Platform.OS === "android" || Platform.OS === "ios"
    ? MapScreenNative
    : MapScreenWeb;

export default function HomeScreen() {
  const [num, setNum] = useState(1);
  const [focused, setFocused] = useState(false);
  const cameraRef = useRef<CameraRef>(null);

  return (
    <View style={styles.container}>
      <MapScreen floor_num={num} cameraRef={cameraRef} />
      <FloorChange num={num} setNum={setNum} />
      <UserLocation cameraRef={cameraRef} />
      <View style={styles.searchBarWrapper}>
        <SearchBar focused={focused} setFocused={setFocused}/>
      </View>
      {focused && (
        <SearchView />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarWrapper: {
    position: "absolute",
    top: 25,
    left: 0,
    right: 0,
    alignItems: "center",
  }
});
