import { AppInitContext } from "@/Context/AppInitContext";
import { Redirect } from "expo-router";
import { useContext } from "react";

export default function TabsIndex() {
  const { ready } = useContext(AppInitContext);
  if (!ready) {
    return null;
  }

  console.log("data ready!")

  return <Redirect href="/(tabs)/home" />;
}
