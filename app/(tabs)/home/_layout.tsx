import { SearchBar } from "@/src/features/home/map/components/controls/searchBar";
import { StyleSheet, View } from "react-native";

export default function HomeIndex() {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchBarWrapper}>
        <SearchBar />
      </View>
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
