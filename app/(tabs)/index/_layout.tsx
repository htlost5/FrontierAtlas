// インデックスレイアウト: ホーム画面（マップ）と検索画面を統合したレイアウト
import { SearchBar } from "@/components/MapUI/interface/searchBar";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

/**
 * インデックスレイアウトコンポーネント
 * - 検索バーを画面上部に固定
 * - Stack ナビゲーションで画面遷移を管理（アニメーションなし）
 * @returns マップと検索画面用のレイアウト
 */
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
