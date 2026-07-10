// ユーザー位置表示ボタン: マップ上で特定座標へカメラをジャンプするコンポーネント
// シンプルなピン型アイコンで表現
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { mapControlShadow } from "@/src/shared/constants/shadowStyles";
import { mapConfig } from "../../constants/mapConfig";
import { useMapContext } from "../../hooks/state/useMapContext";

const PIN_COLOR = "#007AFF";

export function UserLocation() {
  const { cameraRef, colorTheme } = useMapContext();
  const handlePress = () => {
    cameraRef.current?.flyTo(
      mapConfig.default.center,
      mapConfig.animation.duration.flyTo,
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colorTheme?.controls.floorBg ?? "#FFFFFF" },
      ]}
      onPress={handlePress}
    >
      {/* ピン先（丸） */}
      <View style={styles.pinHead} />
      {/* ピン本体（三角） */}
      <View style={styles.pinBody} />
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
  pinHead: {
    position: "absolute",
    backgroundColor: PIN_COLOR,
    height: 16,
    width: 16,
    borderRadius: 8,
    top: 12,
  },
  pinBody: {
    position: "absolute",
    bottom: 14,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: PIN_COLOR,
  },
});
