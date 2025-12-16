// mavigationBarのエラー原因を特定 → 修正 → 一度保留
// bottomTabの調整
// topTabの作成
// 階層メニューの作り方をリサーチ

// components/AppInit.tsx
// import * as NavigationBar from 'expo-navigation-bar';
import loadAll from "@/functions/splash/cacheMaker";
import { useLoadFonts } from "@/hooks/useLoadFonts";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export default function AppInit({ children }: Props) {
  const [isReady, setIsReady] = useState(false);

  const fontsLoaded = useLoadFonts();

  // スプラッシュ画面を自動で閉じないように
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  },[]);

  useEffect(() => {
    if (!fontsLoaded) return;

    async function prepare() {
      try {
        // すべてのマップスクリーン読み込み
        await loadAll();
      } catch (e) {
        console.warn("初期化エラー", e);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, [fontsLoaded]);

  useEffect(() => {
    if (isReady) {
      (async () => SplashScreen.hideAsync())();
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>初期化中...</Text>
      </View>
    );
  }

  return <View style={{ flex: 1 }}>{children}</View>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

// ステータスバー、ナビゲーションバーの色調整
