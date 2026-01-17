import { AppInitContext } from "@/src/AppInit/AppInitContext";
import { Redirect } from "expo-router";
import { useContext } from "react";

export default function TabsIndex() {
  const { cacheReady } = useContext(AppInitContext);
  if (!cacheReady) {
    return null;
  }

  return <Redirect href="/(tabs)/home" />;
}
