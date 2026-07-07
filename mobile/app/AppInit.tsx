// アプリ起動時の初期化を管理するコンポーネント
// スプラッシュスクリーン制御、フォント読み込み、GeoJSONキャッシュ作成を担当

import InitSetup from "@/src/AppInit";
import * as SplashScreen from "expo-splash-screen";
import React from "react";

SplashScreen.preventAutoHideAsync();

// 子コンポーネント（アプリ本体）をラップするProps型
type Props = {
  children: React.ReactNode;
};

// 初期化処理 -> 完了後childrenを描画
export default function AppInit({ children }: Props) {
  return <InitSetup>{children}</InitSetup>;
}
