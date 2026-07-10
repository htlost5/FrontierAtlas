// 初回ロード中に MapContainer の代わりに表示するフルスクリーンローディング
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  message?: string;
};

export function FullScreenLoading({ message = "読み込み中..." }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F7F9",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});
