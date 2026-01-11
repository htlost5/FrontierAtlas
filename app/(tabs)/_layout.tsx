// タブナビゲーション配下のレイアウトコンポーネント
// ボトムタブバーの表示制御とSearchContextの提供を担当

import SelfBottomTabs from "@/components/bottomTabBar/bottomTabBar";
import { Slot, usePathname } from "expo-router";
import React from "react";
import { View } from "react-native";

import { SearchProvider } from "@/Context/SearchContext";

// タブレイアウト: 検索画面以外でボトムタブを表示
export default function TabLayout() {
  const pathName = usePathname();
  // 検索画面ではボトムタブを非表示にする
  const focused = pathName.endsWith("/search");

  return (
    // 検索機能用のContext Providerでラップ
    <SearchProvider>
      <View style={{ flex: 1 }}>
        {/* 子ルート（タブ配下の各画面）を表示 */}
        <Slot />
        {/* 検索画面以外ではボトムタブバーを表示 */}
        {!focused && <SelfBottomTabs />}
      </View>
    </SearchProvider>
  );
}
