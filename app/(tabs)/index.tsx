// app/(tabs)/index.tsx (Home Screen)
import React, {useState} from 'react';
import { StyleSheet, View } from "react-native";

import MapScreen from "../screens/MapScreen";
import FloorChange from "@/components/index/FloorChange";

export default function HomeScreen() {
  const [num, setNum] = useState(5);
  return (
    <View style={styles.container}>
      <MapScreen floor_num={num} />
      <FloorChange num={num} setNum={setNum} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
