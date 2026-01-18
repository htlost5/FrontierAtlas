// タブナビゲーション配下のレイアウトコンポーネント
// ScreenFCの表示制御とSearchContextの提供を担当

import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";

import { SearchProvider } from "@/src/features/home/search/Context/SearchContext";

import { ScreenFC } from "@/src/shared/components";

// タブレイアウト: 検索画面以外でボトムタブを表示
export default function TabLayout() {
  return (
    // 検索機能用のContext Providerでラップ
    <SearchProvider>
      <View style={{ flex: 1 }}>
        {/* 子ルート（タブ配下の各画面）を表示 */}
        <Slot />
        <ScreenFC visible="bottom" />
      </View>
    </SearchProvider>
  );
}
