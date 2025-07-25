// app/(tabs)/index.tsx (Home Screen)
import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    return(
        <SafeAreaView style={styles.SafeAreaView}>
            <Text style={styles.textContainer}>classroom</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    SafeAreaView: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        color: "black"
    }
})