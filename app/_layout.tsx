import { Stack } from "expo-router";
import { enableScreens } from "react-native-screens";
import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import AppInit from "./AppInit";

enableScreens();

export default function RootLayout() {
  return (
    <AppInit>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle={"light-content"} />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </AppInit>
  );
}