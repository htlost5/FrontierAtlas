// app/(tabs)/index.tsx (Home Screen)
import { StyleSheet, View } from "react-native";

import MapScreen from "../screens/MapScreen";
import FloorChange from "@/components/index/FloorChange";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <MapScreen />
      <FloorChange />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
