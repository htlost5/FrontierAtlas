// ホーム画面: 屋内マップの表示と階層切り替え、現在位置表示を統合
import React from "react";
import { StyleSheet, View } from "react-native";

import { FloorChange } from "@/src/features/home/map/components/controls/FloorChange";
import { UserLocation } from "@/src/features/home/map/components/controls/userLocation";

// web実装時、ここにMapScreenWebを実装

// web実装時、MapScreenをプラットフォームにより選択可能に

// マップホーム画面: 階層選択と地図表示を統合したメイン画面
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* 階層切り替えUIコンポーネント（左下の縦型ボタン） */}
      <FloorChange />
      {/* 現在位置ボタン（右下） */}
      <UserLocation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
