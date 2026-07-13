// home タブ配下のレイアウト: SearchProvider でラップし、index と search 両方で検索Contextを利用可能に
import { Slot } from "expo-router";
import React from "react";

import { SearchProvider } from "@/src/features/home/search/Context/SearchContext";

export default function HomeLayout() {
  return (
    <SearchProvider>
      <Slot />
    </SearchProvider>
  );
}
