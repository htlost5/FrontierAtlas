// マップロード中のオーバーレイ表示を提供するコンポーネント。
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  message?: string;
};

export function LoadingOverlay({ visible, message = "読み込み中..." }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  content: {
    alignItems: "center",
    gap: 12,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
