// ホーム画面: 屋内マップと検索機能を統合したメイン画面
import React from "react";
import { StyleSheet, View } from "react-native";

import { MapRoot } from "@/src/features/home/map/MapRoot";
import { MapControlsFC } from "@/src/features/home/map/components/controls";

// ホーム画面: マップルートでラップしたマップコントロールを表示
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <MapRoot>
        <MapControlsFC />
      </MapRoot>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
