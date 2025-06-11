import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CalendarIcon from '../../assets/images/icons/Footer/calendar.svg';
import ClassroomIcon from '../../assets/images/icons/Footer/classroom.svg';
import MeterIcon from '../../assets/images/icons/Footer/foots.svg';
import HomeIcon from '../../assets/images/icons/Footer/home.svg';


interface FooterProps{}

const Footer: React.FC<FooterProps> = () => {
    const icons = [
        {name: 'home', icon: HomeIcon }, // コンポーネントを直接指定
        {name: 'meter', icon: MeterIcon },
        {name: 'calendar', icon: CalendarIcon },
        {name: 'classroom', icon: ClassroomIcon },
    ];

    return (
        <View style={styles.container}>
            {icons.map((icon, index) => (
                <View key={index} style={styles.iconContainer}>
                    <icon.icon></icon.icon>
                    <Text style={styles.iconText}>{icon.name}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#e0e0e0',
    },
    iconContainer: {
        alignItems: 'center',
    },
    icon: { // 不要になったため削除またはコメントアウト
        // width: 110,
        // height: 30,
        // resizeMode: 'contain',
    },
    iconText: {
        fontSize: 15,
        marginTop: 5, // アイコンとの間隔を調整
    },
});

export default Footer;