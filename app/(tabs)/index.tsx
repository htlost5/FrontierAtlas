// app/(tabs)/index.tsx (Home Screen)
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    return(
        <SafeAreaView style={styles.SafeAreaView}>
            <Text>HomeScreen</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    SafeAreaView: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})