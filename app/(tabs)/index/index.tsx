// ホーム画面: 屋内マップの表示と階層切り替え、現在位置表示を統合
import { CameraRef } from "@maplibre/maplibre-react-native";
import React, { useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

import FloorChange from "@/components/MapUI/interface/FloorChange";
import UserLocation from "@/components/MapUI/interface/userLocation";

import MapScreenNative from "../../screens/native/Map/MapScreenNative";
import MapScreenWeb from "../../screens/web/MapScreenWeb";

// プラットフォームに応じてマップコンポーネントを選択（Android/iOS: Native, Web: Web版）
const MapScreen =
  Platform.OS === "android" || Platform.OS === "ios"
    ? MapScreenNative
    : MapScreenWeb;

// マップホーム画面: 階層選択と地図表示を統合したメイン画面
export default function HomeScreen() {
  // 現在表示中の階層番号（1～5階）
  const [num, setNum] = useState(1);
  // マップカメラ操作用のref（現在位置へのズームなどに使用）
  const cameraRef = useRef<CameraRef>(null);

  return (
    <View style={styles.container}>
      {/* メインのマップ表示コンポーネント */}
      <MapScreen floor_num={num} cameraRef={cameraRef} />
      {/* 階層切り替えUIコンポーネント（左下の縦型ボタン） */}
      <FloorChange num={num} setNum={setNum} />
      {/* 現在位置ボタン（右下） */}
      <UserLocation cameraRef={cameraRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
