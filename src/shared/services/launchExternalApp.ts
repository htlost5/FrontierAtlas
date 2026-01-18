// 任意の外部アプリ起動関数

import { Linking, Platform } from "react-native";
import { EXTERNAL_APPS, ExternalAppKey } from "../constants/externalApps";
import { startActivityAsync } from "expo-intent-launcher";

export async function launchApp (key: ExternalAppKey) {
  const config = EXTERNAL_APPS[key];
  if (Platform.OS === "android" && config.androidPackage) {
    try {
      await startActivityAsync("android.intent.MAIN", {
        packageName: config.androidPackage,
      });
      return;
    } catch {
      console.log("classroom error")
    }
  }

  await Linking.openURL(config.webUrl);
}