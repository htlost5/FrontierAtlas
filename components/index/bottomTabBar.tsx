import React from "react";
import { View, StyleSheet, Animated, TouchableOpacity, Linking } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { startActivityAsync } from "expo-intent-launcher";
import { Entypo, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from "@/app/(tabs)";
import Tools from "@/app/(tabs)/tools";
import Calendar from "@/app/(tabs)/calendar";
import Classroom from "@/app/(tabs)/classroom";

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
    const animatedValuesRef = React.useRef<Animated.Value[]>(
        state.routes.map(() => new Animated.Value(0))
    );

    React.useEffect(() => {
        if (animatedValuesRef.current.length !== state.routes.length) {
            animatedValuesRef.current = state.routes.map(() => new Animated.Value(0));
        }
    }, [state.routes]);

    return(
        <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
                const animatedValue = animatedValuesRef.current[index];

                const iconScale = animatedValue.interpolate({
                    inputRange: [0, 60, 100],
                    outputRange: [1, 0.92, 0.85]
                });

                const textScale = animatedValue.interpolate({
                    inputRange: [0, 60, 100],
                    outputRange: [1, 0.95, 0.9]
                });

                // const interPolateIconSize = animatedValue.interpolate({
                //     inputRange: [0, 60, 100],
                //     outputRange: [26, 24, 22]
                // });

                // const interPolateTextSize = animatedValue.interpolate({
                //     inputRange: [0, 60, 100],
                //     outputRange: [12, 11, 10]
                // });

                const isFocused = state.index === index;
                const IconComponent = icons[route.name].lib;
                const iconName = icons[route.name].name;

                const buttonSizeDown = (): Promise<void> => {
                    return new Promise((resolve) => {
                        Animated.timing(animatedValue, {
                            toValue: 100,
                            duration: 75,
                            useNativeDriver: true,
                        }).start();
                        setTimeout(() => {
                            resolve()
                        }, 75)
                    })
                }

                const buttonSizeUp = (): Promise<void> => {
                    return new Promise((resolve) => {
                        buttonSizeDown().finally(() => {
                            Animated.timing(animatedValue, {
                                toValue: 0,
                                duration: 75,
                                useNativeDriver: true,
                            }).start();
                            setTimeout(() => {
                                resolve()
                            }, 75);
                        })
                    })
                }

                const onPress = async() => {
                    buttonSizeUp().finally(async() => {
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
                        };
                        
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        };
                    })
                };

                
                return (
                    <TouchableOpacity key={route.key} onPress={onPress} activeOpacity={1.0} style={{ flex: 1, alignItems: 'center' }}>
                        <Animated.View style={{ transform: [{ scale: iconScale }], alignItems: 'center', justifyContent: 'center' }}>
                            <IconComponent
                                name={iconName}
                                size={26}
                                color={isFocused ? 'blue' : 'gray'}
                            />
                        </Animated.View>
                        <Animated.Text
                            style={[
                                styles.textStyle,
                                { color: isFocused ? 'blue' : 'gray', transform: [{ scale: textScale }] },
                            ]}
                        >
                            {route.name}
                        </Animated.Text>
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
