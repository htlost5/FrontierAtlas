import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, PlatformAndroidStatic, Linking } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Icon, { Entypo, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "@/app/(tabs)";
import Tools from "@/app/(tabs)/tools";
import Calendar from "@/app/(tabs)/calendar";
import Classroom from "@/app/(tabs)/classroom";
import { startActivityAsync } from "expo-intent-launcher";

const icons: Record<string, { lib: any; name: string }> = {
    home: { lib: Feather, name: 'home'},
    tools: { lib: Entypo, name: 'tools'},
    calendar: { lib: Entypo, name: 'calendar'},
    classroom: { lib: MaterialCommunityIcons, name: 'google-classroom'}
}

const ANDROID_PACKAGES = {
    classroom: 'classroom.google.com'
}

const appURLs = {
    classroom: 'https://classroom.google.com/'
};

function MyTabBar({ state, navigation }: BottomTabBarProps) {
    return(
        <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                const IconComponent = icons[route.name].lib;
                const iconName = icons[route.name].name;

                const onPress = async() => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (route.name === 'classroom') {
                        event.preventDefault();
                        try {
                            await startActivityAsync(
                                "android.intent.MAIN",
                                { packageName: ANDROID_PACKAGES.classroom }
                            );
                        } catch(e) {
                            console.log(e);
                            Linking.openURL(appURLs.classroom);
                        };
                        return;
                    }

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    };
                };

                
                return (
                    <TouchableOpacity key={route.key} onPress={onPress} style={{ flex: 1, alignItems: 'center' }}>
                        <IconComponent
                            name={iconName}
                            size={24}
                            color={isFocused ? 'blue' : 'gray'}
                        />
                        <Text style={[styles.textStyle, { color: isFocused ? 'blue' : 'gray' }]}>{route.name}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}

const Tab = createBottomTabNavigator();

export default function SelfBottomTabs() {
    return (
        <Tab.Navigator
            tabBar={(props) => <MyTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="home" component={HomeScreen} />
            <Tab.Screen name="tools" component={Tools} />
            <Tab.Screen name="calendar" component={Calendar} />
            <Tab.Screen name="classroom" component={Classroom} />
        </Tab.Navigator>
    )
}

// タブコンポーネント
// タップ時に画面偏移
// タップ時にコンポーネントのアニメーション

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: 'white',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#CCCCCC'
    },
    textStyle: {
        color: '#000000',
        fontSize: 10
    }
})

// 改めて機能確認
// タップ時のアニメーション調整
// スタイルの確認
// 色合いの調整
