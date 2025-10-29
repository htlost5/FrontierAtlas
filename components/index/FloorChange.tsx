import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    floor: number
}

export function FloorChoose({floor}: Props) {
    return(
        <TouchableOpacity>
            <Text style={styles.textFont}>{floor}</Text>
        </TouchableOpacity>
    )
}

export default function FloorChange() {
    return(
        <View style={styles.container}>
            <FloorChoose floor={1} />
            <FloorChoose floor={2} />
            <FloorChoose floor={3} />
            <FloorChoose floor={4} />
            <FloorChoose floor={5} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
    },
    textFont: {
        color: 'black',
        fontSize: 25,
        marginHorizontal: 20
    }
})