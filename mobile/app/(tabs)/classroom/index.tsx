// 教室画面: Google Classroom へのリンク機能を持つ画面（現在はダミー）
import { APP_FONTS, FONT_SIZE } from "@/src/shared/constants/typography";
import { StyleSheet, Text, View } from "react-native";

/**
 * 教室画面コンポーネント
 * @returns 教室画面用のビュー（Google Classroom へのリンク予定）
 */
export default function Classroom() {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>classroom</Text>
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
    fontSize: FONT_SIZE.heading,
    fontFamily: APP_FONTS.lunaChord,
  },
});
