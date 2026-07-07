// タブのルートアクセス時にホームタブへリダイレクトするエントリーポイントです。
import { Redirect } from "expo-router";

export default function TabsIndex() {
  return <Redirect href="/(tabs)/home" />;
}
