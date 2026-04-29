// Header コンポーネントを定義する。
import { Image, StyleSheet, View } from "react-native";

import FrontierAtlasLogo from "@/assets/images/appLogo/FrontierAtlasLogo_white.png"; // リネームに合わせて修正

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

// interface HeaderProps {}

// const Header: React.FC<HeaderProps> = () => {
//   return (
//     <View style={[styles.headerContainer]}>
//       <View style={styles.logoWrapper}>
//         <Image
//           source={FrontierAtlasLogo}
//           style={styles.logoStyle}
//           resizeMode="contain"
//         />
//       </View>
//     </View>
//   );
// };

const account_size = "80%";

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
    width: account_size || "80%",
    height: account_size || "80%",
  },
});
