import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type Props = {
  floor: number;
  onPress: (floor: number) => void;
  isFocused: boolean;
};

export function FloorChoose({ floor, onPress, isFocused }: Props) {
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
type Props_change = {
  num: number;
  setNum: React.Dispatch<React.SetStateAction<number>>;
};

const floors = [5, 4, 3, 2, 1];

export default function FloorChange({ num, setNum }: Props_change) {
  const handlePress = (floor: number) => {
    if (floor !== num) {
      setNum(floor);
      console.log(`floor${floor} pressed!`);
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
      {floors.map((data) => (
        <FloorChoose
          key={data}
          floor={data}
          onPress={handlePress}
          isFocused={data === num} // 選択中かどうか
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
