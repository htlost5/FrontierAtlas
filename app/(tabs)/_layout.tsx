import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";


export default function TabLayout() {
  return (
    <View style={{ flex:1 }}>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="tools" options={{ href: null }} />
        <Tabs.Screen name="calendar" options={{ href: null }} />
        <Tabs.Screen name="classroom" options={{ href: null }} />
      </Tabs>
      <Footer />
    </View>
  );
}