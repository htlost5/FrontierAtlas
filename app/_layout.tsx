import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";

import AppInit from "./AppInit";

export default function RootLayout() {
  return (
    <AppInit>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#3f15b3ff" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </AppInit>
  );
}