// 404エラーページ: ルート不一致時に表示
import { Text, View } from "react-native";

/**
 * 存在しないルートにアクセスした際の404エラーコンポーネント
 * @returns エラーメッセージを表示するビュー
 */
export default function notFound() {
  return (
    <View>
      <Text>page not found</Text>
    </View>
  );
}
