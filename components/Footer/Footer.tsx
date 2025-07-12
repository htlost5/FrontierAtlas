import { useRouter, useSegments } from 'expo-router';
import React from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';

import CalendarIcon from '../../assets/images/icons/Footer/calendar.svg';
import ClassroomIcon from '../../assets/images/icons/Footer/classroom.svg';
import HomeIcon from '../../assets/images/icons/Footer/home.svg';
import ToolIcon from '../../assets/images/icons/Footer/tools.svg';


interface FooterProps{}

const Footer: React.FC<FooterProps> = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const segments = useSegments();

    const currentSegment = segments[segments.length - 1];

    console.log('currentSegment:', currentSegment)

    const icons = [
        {name: 'home', icon: HomeIcon, path: '', size: 24 }, // コンポーネントを直接指定
        {name: 'tools', icon: ToolIcon, path: 'tools', size: 26 },
        {name: 'calendar', icon: CalendarIcon, path: 'calendar', size: 24 },
        {name: 'classroom', icon: ClassroomIcon, path: 'classroom', size: 24 },
    ];

    const ANDROID_PACKAGES = {
        classroom: 'com.google.android.apps.classroom'
    };

    const URLs = {
        classrom: 'https://classroom.google.com/'
    };

    const handlePress = async (path: string) => {
        if (path !== "classroom"){
            router.replace(`/(tabs)/${path ? `/${path}` : ''}`);
        }else{
            try{
                await startActivityAsync(
                    android.intent.action.MAIN,
                    { packageName: ANDROID_PACKAGES.classroom }
                );
            } catch(e) {
                console.log('Failed to open Android app by package name:', e);
                Linking.openURL(URLs.classrom);
            };
        };
    }

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            {icons.map((item, index) => {
                let  isActive = false;
                if (item.path === '') {
                    isActive = (
                        currentSegment === undefined ||
                        currentSegment === '(tabs)'
                    );
                } else {
                    isActive = currentSegment === item.path;
                }

                const iconColor = isActive ? '#007bff' : '#6c757d';
                
                return(
                    <TouchableOpacity
                        key={index}
                        style={styles.iconContainer}
                        onPress={() => handlePress(item.path)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.iconWrapper}>
                            <item.icon
                                width={item.size}
                                height={item.size}
                                fill={iconColor}
                            />
                        </View>
                        <Text
                            style={[
                                styles.iconText,
                                { color: iconColor}
                            ]}
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute', 
        bottom: 0,
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: 'white',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#cccccc'
    },
    iconContainer: {
        alignItems: 'center',
    },
    iconWrapper: { 
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 13, //　テキストサイズを調整
        marginTop: 5, // アイコンとの間隔を調整
    },
});

export default Footer;