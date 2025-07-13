// components/AppInit.tsx
import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";

type Props = {
  children: React.ReactNode;
};

export default function AppInit({ children }: Props) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // スプラッシュ画面を自動非表示しないようにロック
        await SplashScreen.preventAutoHideAsync();

        // ここでフォントやAPIの初期化をやる（必要に応じて）
        // await Font.loadAsync(...);
        // await fetchInitialData();

        await 

      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        // 初期化完了したらスプラッシュ非表示
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!isReady) {
    // スプラッシュ画面のまま何も表示しない
    return null;
  }

  // 初期化完了後は通常画面を表示
  return <>{children}</>;
}
