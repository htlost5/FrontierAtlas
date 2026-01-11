// React Navigationのスクリーン最適化とルーティングをインポート
import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";

import AppInit from "./AppInit";

// react-native-screensのネイティブスクリーン最適化を有効化
enableScreens();

// アプリ全体のルートレイアウト: 初期化、SafeArea、ステータスバー、ナビゲーション設定
export default function RootLayout() {
  return (
    // アプリ起動時の初期化処理（フォント読み込み、GeoJSONキャッシュ作成）
    <AppInit>
      {/* セーフエリア対応（ノッチやステータスバー領域を考慮） */}
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          {/* ステータスバーを透明化・ダークコンテンツ表示 */}
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent={true}
          />
          {/* Expo Routerのスタックナビゲーション */}
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false, animation: "none" }}
            />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </AppInit>
  );
}
