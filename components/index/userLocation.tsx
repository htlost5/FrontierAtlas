import { CameraRef } from "@maplibre/maplibre-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  cameraRef: React.RefObject<CameraRef | null>;
};

export default function UserLocation({ cameraRef }: Props) {
  const handlePress = () => {
    cameraRef.current?.flyTo([139.6784895108818, 35.49777179199512], 750);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.out1} />
      <View style={styles.out2} />
      <View style={styles.out3} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 20,
    right: 10,
    bottom: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  out1: {
    position: "absolute",
    backgroundColor: "#6299ffff",
    opacity: 0.5,
    height: 35,
    width: 35,
    borderRadius: 100,
  },
  out2: {
    position: "absolute",
    backgroundColor: "#ffffff",
    opacity: 1,
    height: 14,
    width: 14,
    borderRadius: 100,
  },
  out3: {
    position: "absolute",
    backgroundColor: "#0059ff",
    opacity: 1,
    height: 10,
    width: 10,
    borderRadius: 100,
  },
});
