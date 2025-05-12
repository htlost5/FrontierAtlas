import Footer from "@/components/Footer/Footer";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function App() {
    return (
        <View style={styles.container}>
            <Footer />i
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});