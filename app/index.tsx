import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Footer from "@/components/Footer/Footer";

export default function HomeScreen() {
  return (
    <View>
      <Text style={styles.text}>
        この領域はセルフエリア内です！
      </Text>
      <View style={styles.childView}>
        <Text>
          子コンポーネント
        </Text>
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  SafeAreaContent: {
    flex: 1,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'navy',
  },
  childView: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'lightgreen',
    borderRadius: 8,
  },
});