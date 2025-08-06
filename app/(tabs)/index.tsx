// app/(tabs)/index.tsx (Home Screen)
import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Floor5 from "../screens/Map/Floors/Floor5";

export default function Home() {
    return(
        <SafeAreaView style={styles.SafeAreaView}>
            <Floor5 />
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