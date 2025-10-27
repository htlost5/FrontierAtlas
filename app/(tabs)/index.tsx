// app/(tabs)/index.tsx (Home Screen)
import { StyleSheet, View } from "react-native";
import Floor5 from "../screens/Map/Floors/Floor5";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Floor5 />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
