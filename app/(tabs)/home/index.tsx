// ホーム画面: 屋内マップの表示と階層切り替え、現在位置表示を統合
import React from "react";
import { StyleSheet, View } from "react-native";

import { MapControlsFC } from "@/src/features/home/map/components/controls";

// web実装時、ここにMapScreenWebを実装

// web実装時、MapScreenをプラットフォームにより選択可能に

// マップホーム画面: 階層選択と地図表示を統合したメイン画面
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <MapControlsFC />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
