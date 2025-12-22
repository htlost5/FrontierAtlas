import SearchBar from "@/components/MapUI/interface/searchBar";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function IndexLayout() {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchBarWrapper}>
        <SearchBar />
      </View>
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarWrapper: {
    position: "absolute",
    top: 25,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
});
