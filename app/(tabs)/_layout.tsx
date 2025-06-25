import { Tabs } from "expo-router";
import Footer from "@/components/Footer/Footer";
import React from "react";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <View style={{ flex:1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="meter" options={{ href: null }} />
        <Tabs.Screen name="calendar" options={{ href: null }} />
        <Tabs.Screen name="classroom" options={{ href: null }} />
      </Tabs>
      <Footer />
    </View>
  );
}