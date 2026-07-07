// マップ上のコントロール要素に共通のシャドウスタイルを提供する。
import { Platform } from "react-native";

export const mapControlShadow = Platform.select({
  android: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  ios: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  web: {
    boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
  },
});
