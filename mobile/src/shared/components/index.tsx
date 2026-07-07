// components の公開エクスポートをまとめる。
import { StyleSheet, View } from "react-native";
import { HeaderTabs } from "./Header/Header";
import { BottomTabs } from "./bottomTabBar";

type Visibility = "all" | "header" | "bottom" | "nothing";

type Props = {
  visible: Visibility;
};

export function ScreenFC({ visible }: Props) {
  const showHeader = visible === "all" || visible === "header";
  const showBottom = visible === "all" || visible === "bottom";

  return (
    <>
      <View style={styles.header}>
        <HeaderTabs isVisible={showHeader} />
      </View>
      <View style={styles.bottom}>
        <BottomTabs isVisible={showBottom} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  }
})