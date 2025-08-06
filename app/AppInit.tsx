// components/AppInit.tsx
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export default function AppInit({ children }: Props) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // スプラッシュ画面を自動で閉じないように設定
        await SplashScreen.preventAutoHideAsync();

        // 初期化処理をここに（必要に応じて追加）
        // await loadFonts();
        // await fetchInitialData();

      } catch (e) {
        console.warn("初期化エラー:", e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
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

  return (
    <View style={{ flex: 1 }}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
