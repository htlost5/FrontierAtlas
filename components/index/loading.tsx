import { JSX } from "react";
import { Text, View, StyleSheet } from "react-native";

type Props = {
    loading: boolean,
    geoJson: any
}

function LoadingFloor({loading, geoJson}: Props): JSX.Element | null {
    if (loading || !geoJson) {
        return(
            <View
                style={[
                    styles.screen,
                    { justifyContent: 'center', alignItems: 'center' },
                ]}
            >
                <Text>loading GeoJson...</Text>
            </View>
        );
    }
    return null;
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})

export { LoadingFloor };