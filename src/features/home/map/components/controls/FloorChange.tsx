// マップ上で1階から5階までのフロアを切り替えるUIコンポーネント
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useMapContext } from "../../hooks/MapContext/useMapContext";

// 個別の階層ボタンのプロパティ定義
type Props = {
  floor: number;
  onPress: (floor: number) => void;
  isFocused: boolean;
};

// 単一の階層ボタンを描画するコンポーネント（選択状態で背景色を変更）
function FloorChoose({ floor, onPress, isFocused }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.block,
        {
          backgroundColor: isFocused
            ? "rgba(0,140,255,0.45)"
            : "rgba(0, 0, 0, 0)",
        },
      ]}
      onPress={() => onPress(floor)}
    >
      <Text style={styles.textFont}>{floor}</Text>
    </TouchableOpacity>
  );
}

const floors = [5, 4, 3, 2, 1];

// 全フロアのボタンリストを表示し、選択された階層を管理するメインコンポーネント
export function FloorChange() {
  const { floor, setFloor } = useMapContext();

  const handlePress = (f: number) => {
    if (f !== floor) {
      setFloor(f);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {floors.map((f) => (
        <FloorChoose
          key={f}
          floor={f}
          onPress={handlePress}
          isFocused={f === floor} // 選択中かどうか
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "column",
    marginVertical: 15,
    bottom: 50,
    backgroundColor: "white",
    left: 20,
    borderRadius: 100,
    width: 46,
    height: 200,
    ...Platform.select({
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
    }),
  },
  block: {
    width: 40,
    height: 40,
    marginVertical: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  textFont: {
    color: "black",
    fontSize: 16,
  },
});
