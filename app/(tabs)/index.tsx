// app/(tabs)/index.tsx (Home Screen)
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    return(
        <SafeAreaView style={styles.SafeAreaView}>
<<<<<<< HEAD
            <Text>HomeScreen</Text>
=======
            <Text style={styles.textContainer}>Home Screen</Text>
>>>>>>> build
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
        color: "black",
    }
})