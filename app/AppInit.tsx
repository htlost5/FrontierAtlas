// アプリ起動時の初期化を管理するコンポーネント
// スプラッシュスクリーン制御、フォント読み込み、GeoJSONキャッシュ作成を担当

import { AppInitContext } from "@/Context/AppInitContext";
import { loadAllImproved } from "@/functions/splash/cacheMaker";
import { useLoadFonts } from "@/hooks/useLoadFonts";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

// 子コンポーネント（アプリ本体）をラップするProps型
type Props = {
  children: React.ReactNode;
};

// アプリ起動時の初期化処理を行うラッパーコンポーネント
// フォント読み込み完了後、GeoJSONキャッシュを作成し、準備完了でスプラッシュを非表示
export default function AppInit({ children }: Props) {
  const [isReady, setIsReady] = useState(false);

  // カスタムフォント（Y1LunaChord）の読み込み
  const fontsLoaded = useLoadFonts();

  // スプラッシュスクリーンを自動で非表示にしないよう制御
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  // フォント読み込み完了後、GeoJSONキャッシュを作成
  useEffect(() => {
    if (!fontsLoaded) return;

    async function prepare() {
      try {
        // すべてのマップGeoJSONデータをキャッシュディレクトリにコピー
        await loadAllImproved();
        setIsReady(true);
      } catch (e) {
        console.warn("初期化エラー", e);
      }
    }
    prepare();
  }, [fontsLoaded]);

  // 初期化完了後にスプラッシュスクリーンを非表示
  useEffect(() => {
    if (isReady) {
      (async () => SplashScreen.hideAsync())();
    }
  }, [isReady]);

  // 初期化中はローディングインジケーターを表示
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>初期化中...</Text>
      </View>
    );
  }

  // 初期化完了後、子コンポーネント（アプリ本体）をレンダリング
  return (
    <AppInitContext.Provider value={{ cacheReady: true }}>
      <View style={{ flex: 1 }}>{children}</View>
    </AppInitContext.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

// ステータスバー、ナビゲーションバーの色調整
