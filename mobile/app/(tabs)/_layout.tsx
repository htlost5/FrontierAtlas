// タブナビゲーション配下のレイアウトコンポーネント
// 子ルートの表示制御とボトムUIの表示を担当

import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";

import { ScreenFC } from "@/src/shared/components";

// タブレイアウト: 子ルート（各タブ画面）を表示し、ボトムUIを常駐
export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <ScreenFC visible="bottom" />
    </View>
  );
}
