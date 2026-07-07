// ユーザー位置表示ボタン: マップ上で特定座標へカメラをジャンプするコンポーネント
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { mapControlShadow } from "@/src/shared/constants/shadowStyles";
import { mapConfig } from "../../constants/mapConfig";
import { useMapContext } from "../../hooks/state/useMapContext";

export function UserLocation() {
  const { cameraRef } = useMapContext();
  const handlePress = () => {
    cameraRef.current?.flyTo(mapConfig.default.center, mapConfig.animation.duration.flyTo);
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
    bottom: 70,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    ...mapControlShadow,
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
