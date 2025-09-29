// import React from 'react';
// import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Animated } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { getBottomSpace } from 'react-native-iphone-x-helper'

// function HomeScreen() {
//   return (
//     <View style={styles.conteiner}>
//       <Text style={{color: '#fefdff'}}>Home!</Text>
//     </View>
//   );
// }

// function SettingsScreen() {
//   return (
//     <View style={styles.conteiner}>
//       <Text style={{color: '#fefdff'}}>Settings!</Text>
//     </View>
//   );
// }

// function PremiumScreen() {
//   return (
//     <View style={styles.conteiner}>
//       <Text style={{color: '#fefdff'}}>Premium!</Text>
//     </View>
//   )
// }

// const Tab = createBottomTabNavigator();

// function MyTabBar({state, navigation}) {
//   return (
//     <View style={styles.tabbar}>
//       {state.routes.map((route, index) => {

//         const AnimatedIcon = Animated.createAnimatedComponent(Icon);
//         const AnimatedText = Animated.createAnimatedComponent(Text);
//         const animatedValue = new Animated.Value(0);
//         const interPolateIconSize = animatedValue.interpolate({
//           inputRange: [0, 60, 100],
//           outputRange: [28, 26, 24],
//         });
//         const interPolateTextSize = animatedValue.interpolate({
//           inputRange: [0, 60, 100],
//           outputRange: [12, 11, 10],
//         });

//         const icons = {
//           Home: 'home',
//           Settings: 'settings',
//           Premium: 'spotify',
//         }
//         let isFocused = (state.index == index);

//         const buttonSizeDown = () => {
//           return new Promise((resolve) => {
//             Animated.timing(animatedValue, {
//               toValue: 100,
//               duration: 75,
//               useNativeDriver: false,
//             }).start();
//             setTimeout(() => {
//               resolve()
//             }, 75)
//           })
//         }

//         const buttonSizeUp = () => {
//           return new Promise((resolve) => {
//             buttonSizeDown().finally(() => {
//               Animated.timing(animatedValue, {
//                 toValue: 0,
//                 duration: 75,
//                 useNativeDriver: false,
//               }).start();
//               setTimeout(() => {
//                 resolve()
//               }, 75);
//               })
//             })
//           }

//           const _onPress = () => {
//             buttonSizeUp().finally(() => {
//               const event = navigation.emit({
//                 type: 'tabPress',
//                 target: route.key,
//               });
//               if (!isFocused && !event.defaultPrevented) {
//                 navigation.navigate(route.name);
//               };
//             })
//           }

//         return (
//           <View style={styles.tabButton} key={route.name}>
//             <TouchableOpacity
//               onPress={_onPress}
//               activeOpacity={1.0}
//               style={{ width:50, height:50, alignItems: 'center', justifyContent: 'center' }}
//             >
//               <AnimatedIcon
//                 name={(isFocused | (route.name == 'Premium')) ? icons[route.name] : icons[route.name] + '-outline'}
//                 color={isFocused ? '#fefdff' : '#b7b4b7'}
//                 style={[styles.tabButtonIcon, {fontSize: interPolateIconSize}]}
//               />
//               <AnimatedText style={{color: isFocused ? '#fefdff' : '#b7b4b7', fontSize: interPolateTextSize}}>{route.name}</AnimatedText>
//             </TouchableOpacity>
//           </View>
//         )
//       })}
//     </View>
//   )
// };

// function MyTabs() {
//   return (
//     <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
//       <Tab.Screen name='Home' component={HomeScreen} />
//       <Tab.Screen name='Settings' component={SettingsScreen} />
//       <Tab.Screen name='Premium' component={PremiumScreen} />
//     </Tab.Navigator>
//   );
// }

// export default function App() {
//   StatusBar.setBarStyle('light-content', true);
//   return (
//     <NavigationContainer>
//       <MyTabs />
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   conteiner: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#151116',
//   },
//   tabbar: {
//     height: 60 + getBottomSpace(),
//     width: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#2A272C',
//     paddingBottom: getBottomSpace(),
//   },
//   tabButton: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   tabButtonIcon: {
//     marginVertical: 4,
//   },
//   tabLabel : {
//     fontSize: 12,
//   }
// })
