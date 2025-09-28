import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import SelfBottomTabs from "@/components/index/bottomTabBar";
import Header from "@/components/Header/Header";

export default function TabLayout() {
  return (
    <View  style={{ flex: 1 }}>
      <Header />
      <SelfBottomTabs />
    </View>
  );
}