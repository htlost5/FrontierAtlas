import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";

import AppInit from "./AppInit";

export default function RootLayout() {
  return (
    <AppInit>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#6a51ae" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </AppInit>
  );
}