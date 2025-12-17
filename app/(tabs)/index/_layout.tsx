import SearchBar from "@/components/MapComponents/searchBar";
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function IndexLayout() {
    return (
        <View style={{flex: 1}}>
            <View style={styles.searchBarWrapper}>
                <SearchBar />
            </View>
            <Stack screenOptions={{ headerShown: false, animation: "none"}} />
        </View>
    )
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