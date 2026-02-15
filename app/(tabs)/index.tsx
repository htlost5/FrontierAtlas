import { Redirect } from "expo-router";

export default function TabsIndex() {
  return <Redirect href="/(tabs)/home" />;
}

// ログイン判定を付ける場合は、useEffectを利用した分岐ロジックを実装
// router.replace
