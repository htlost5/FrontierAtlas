import React from "react";
import { useRouter, useSegments } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FloorChangeProps {}

const FloorChange: React.FC<FloorChangeProps> = () => {
    const router = useRouter();

    const touchAction = () => {
        console.log("pressed!!")
    };

    const floorChangeFunc = async(n: number) => {
        console.log(`${n}F`);
        console.log(`../screens/Map/Floors/Floor${n}.tsx`)
        router.push(`/screens/Map/Floors/Floor${n}` as any);
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.box}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <TouchableOpacity key={num} onPress={() => floorChangeFunc(num)} style={styles.touchable}>
                        <View style={styles.Floors}>
                            <Text style={styles.textStyle}>{num}F</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
};


export default FloorChange;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        paddingHorizontal: 30,
    },
    box: {
        flexDirection: 'column',
        height: 300,
        width: 50,
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'stretch',
    },
    touchable: {
        flex: 1,
        width: '100%'
    },
    Floors: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        margin: 2,
        borderRadius: 5,
        overflow: 'hidden',
    },
    textStyle: {
        color: 'black',
        fontSize: 20
    }
});