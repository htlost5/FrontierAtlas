// app/(tabs)/index.tsx (Home Screen)
import { StyleSheet, Text, View } from "react-native";

export default function Calendar() {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>calendar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    color: "black",
    fontSize: 20,
    fontFamily: "Y1LunaChord",
  },
});
