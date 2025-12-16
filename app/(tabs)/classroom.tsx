// app/(tabs)/index.tsx (Home Screen)
import { StyleSheet, Text, View } from "react-native";

export default function Classroom() {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>classroom</Text>
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
