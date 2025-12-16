import { StyleSheet, Text, View } from "react-native";

export default function SearchBar() {
  return (
    <View style={styles.searchBox}>
      <Text style={styles.text}>input the room here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    height: 55,
    width: 400,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
  },
  text: {
    fontSize: 10,
    color: "black",
  },
});
