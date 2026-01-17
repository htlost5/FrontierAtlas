// 検索結果表示画面: 検索文字列と検索結果を表示するビュー
import { useSearch } from "@/src/features/home/search/Context/SearchContext";
import { Image, StyleSheet, Text, View } from "react-native";

/**
 * 検索結果表示コンポーネント
 * - SearchContext から検索テキストと結果を取得
 * - アイコン、検索キーワード、結果を縦に配置
 * @returns 検索結果を表示するビュー
 */
export default function SearchView() {
  const { searchText, answerText } = useSearch();

  return (
    <View style={styles.container}>
      <View style={styles.viewPlace}>
        <View style={styles.optionContainer}>
          <View style={styles.iconWrapper}>
            <Image
              style={styles.icon}
              source={require("@/assets/images/icons/MapView/map/unitIcons/classroom.png")}
            />
          </View>
          <View style={styles.textWrapper}>
            <View style={styles.textBoxFirst}>
              <Text style={styles.textFirst}>{searchText}</Text>
            </View>
            <View style={styles.textBoxSecond}>
              <Text style={styles.textSecond}>{answerText}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  viewPlace: {
    // backgroundColor: "orange",
    height: 600,
    width: "100%",
  },
  optionContainer: {
    // backgroundColor: "green",
    height: 60,
    width: "100%",
    paddingHorizontal: 30,
    alignItems: "center",
    flexDirection: "row",
  },
  iconWrapper: {
    height: 40,
    width: 40,
    backgroundColor: "#F2F2F2",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    height: "76%",
    width: "76%",
  },
  textWrapper: {
    // backgroundColor: "purple",
    height: "100%",
    width: "100%",
    marginLeft: 30,
  },
  textBoxFirst: {
    // backgroundColor: "lightgreen",
    height: "50%",
    justifyContent: "center",
  },
  textFirst: {
    fontSize: 22,
  },
  textBoxSecond: {
    // backgroundColor: "lightblue",
    height: "50%",
    justifyContent: "center",
  },
  textSecond: {
    fontSize: 18,
  },
});
