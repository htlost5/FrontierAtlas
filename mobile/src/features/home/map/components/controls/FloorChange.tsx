// マップ上で1階から5階までのフロアを切り替えるUIコンポーネント
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { mapControlShadow } from "@/src/shared/constants/shadowStyles";
import { useMapContext } from "../../hooks/state/useMapContext";
import * as Haptics from "expo-haptics";
import { FONT_SIZE } from "@/src/shared/constants/typography";

// 個別の階層ボタンのプロパティ定義
type Props = {
  floor: number;
  onPress: (floor: number) => void;
  isFocused: boolean;
  theme: {
    bg: string;
    selectedBg: string;
    text: string;
    selectedText: string;
  };
};

// 単一の階層ボタンを描画するコンポーネント（選択状態で背景色を変更）
function FloorChoose({ floor, onPress, isFocused, theme }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.block,
        {
          backgroundColor: isFocused ? theme.selectedBg : "rgba(0, 0, 0, 0)",
        },
      ]}
      onPress={() => onPress(floor)}
    >
      <Text
        style={[
          styles.textFont,
          {
            color: isFocused ? theme.selectedText : theme.text,
            fontWeight: isFocused ? "700" : "400",
          },
        ]}
      >
        {`${floor}F`}
      </Text>
    </TouchableOpacity>
  );
}

const floors = [5, 4, 3, 2, 1];

// 全フロアのボタンリストを表示し、選択された階層を管理するメインコンポーネント
export function FloorChange() {
  const { floor, setFloor, colorTheme } = useMapContext();

  const handlePress = (f: number) => {
    if (f !== floor) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setFloor(f);
    }
  };

  const theme = {
    bg: colorTheme.controls.floorBg,
    selectedBg: colorTheme.controls.floorSelectedBg,
    text: colorTheme.controls.floorText,
    selectedText: colorTheme.controls.floorSelectedText,
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
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
          isFocused={f === floor}
          theme={theme}
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
    bottom: 65,
    left: 20,
    borderRadius: 100,
    width: 46,
    height: 200,
    ...mapControlShadow,
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
    fontSize: FONT_SIZE.floorControl,
  },
});
