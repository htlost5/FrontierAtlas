import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";

import AppInit from "./AppInit";

export default function RootLayout() {
  return (
    <AppInit>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#240f5eff" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </AppInit>
  );
}