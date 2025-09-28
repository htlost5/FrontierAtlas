// app/(tabs)/index.tsx (Home Screen)
import { View, Text, StyleSheet } from "react-native";

export default function Tools() {
    return(
        <View style={styles.container}>
            <Text style={styles.textStyle}>tools</Text>
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