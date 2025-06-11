import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.SafeAreaContent}>
      <Stack>
      <Stack.Screen
        name='index'
        options={{
          headerShown: false,
          title: 'Welcome',
        }}
      />
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeAreaContent: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  }
});