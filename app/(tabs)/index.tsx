// app/(tabs)/index.tsx (Home Screen)
import React, {useRef, useState} from 'react';
import { StyleSheet, View } from "react-native";
import { CameraRef, MapViewRef } from '@maplibre/maplibre-react-native';

import MapScreen from "../screens/MapScreen";
import FloorChange from "@/components/index/FloorChange";
import UserLocation from '@/components/index/userLocation';

export default function HomeScreen() {
  const [num, setNum] = useState(5);
  const cameraRef = useRef<CameraRef>(null);
  const mapViewRef = useRef<MapViewRef>(null);

  return (
    <View style={styles.container}>
      <MapScreen floor_num={num} cameraRef={cameraRef} mapViewRef={mapViewRef}/>
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
