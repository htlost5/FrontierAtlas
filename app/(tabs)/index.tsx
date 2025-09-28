// app/(tabs)/index.tsx (Home Screen)
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
    return(
        <View style={styles.container}>
            <Text style={styles.textStyle}>Hello Worlld!!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        color: "black",
    }
})