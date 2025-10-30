import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  floor: number;
};

export function FloorChoose({ floor }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.block,
        {
          backgroundColor: "rgba(0, 140, 255, 0.45)",
        },
      ]}
    >
      <Text style={styles.textFont}>{floor}</Text>
    </TouchableOpacity>
  );
}

const floor = [5, 4, 3, 2, 1];

export default function FloorChange() {
  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {floor.map(data => {
        return(
          <FloorChoose key={data} floor={data} />
        )
      })}
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
