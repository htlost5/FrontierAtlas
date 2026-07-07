// Header コンポーネントを定義する。
import { Image, StyleSheet, View } from "react-native";

import FrontierAtlasLogo from "@/assets/images/appLogo/FrontierAtlasLogo_white.png";

type Props = {
  isVisible: boolean;
};

export function HeaderTabs({ isVisible }: Props) {
  if (!isVisible) return null;
  return (
    <View style={[styles.headerContainer]}>
      <View style={styles.logoWrapper}>
        <Image
          source={FrontierAtlasLogo}
          style={styles.logoStyle}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "white",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#000000",
  },
  logoWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logoStyle: {
    width: "80%",
    height: "80%",
  },
});
