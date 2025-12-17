import SelfBottomTabs from "@/components/bottomTabBar/bottomTabBar";
import { Slot, usePathname } from "expo-router";
import React from "react";
import { View } from "react-native";
// import Header from "@/components/Header/Header";

import { SearchProvider } from "@/Context/SearchContext";

export default function TabLayout() {
  const pathName = usePathname();
  const focused = pathName.endsWith("/search");

  return (
    <SearchProvider>
      <View style={{ flex: 1 }}>
        <Slot />
        {/* <Header /> */}
        {!focused && <SelfBottomTabs />}
      </View>
    </SearchProvider>
  );
}
