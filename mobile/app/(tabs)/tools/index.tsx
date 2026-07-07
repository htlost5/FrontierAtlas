// ツール画面: タブバーの「tools」ボタンに対応したダミー画面
import { StyleSheet, Text, View } from "react-native";

/**
 * ツール画面コンポーネント
 * @returns ツール画面用のビュー（現在はプレースホルダー）
 */
export default function Tools() {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>tools</Text>
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
