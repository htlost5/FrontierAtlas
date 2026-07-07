// カレンダー画面: タブバーの「calendar」ボタンに対応したダミー画面
import { StyleSheet, Text, View } from "react-native";

/**
 * カレンダー画面コンポーネント
 * @returns カレンダー画面用のビュー（現在はプレースホルダー）
 */
export default function Calendar() {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>calendar</Text>
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
