import { Image, StyleSheet, Text, View } from 'react-native';
import React = require('react');
import home from "../../assets/images/icons/Footer/home.svg";
import meter from "../../assets/images/icons/Footer/foots.svg";
import calendar from "../../assets/images/icons/Footer/calendar.svg";
import classroom from "../../assets/images/icons/Footer/classroom.svg";


interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
    const icons = [
        {name: 'home', icon: home },
        {name: 'meter', icon: meter },
        {name: 'calendar', icon: calendar },
        {name: 'classroom', icon: classroom },
    ];

    return (
        <View style={styles.container}>
            {icons.map((icon, index) => (
                <View key={index} style={styles.iconContainer}>
                    <Image source={icon.Path} style={styles.icon} />
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
    icon: {
        width: 110,
        height: 30,
        resizeMode: 'contain',
    },
    iconText: {
        fontSize: 15,
        marginTop: 0,
    },
});

export default Footer;