// import React from 'react';
// import { Text, View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
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

//         const icons = {
//           Home: 'home',
//           Settings: 'settings',
//           Premium: 'spotify',
//         }
//         let isFocused = (state.index === index);

//         const _onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//           });
//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name);
//           };
//         };

//         return (
//           <View style={styles.tabButton} key={route.name}>
//             <TouchableOpacity
//               onPress={_onPress}
//               style={{ width:50, height:50, alignItems: 'center', justifyContent: 'center' }}
//             >
//               <Icon
//                 name={(isFocused | (route.name === 'Premium')) ? icons[route.name] : icons[route.name] + '-outline'}
//                 size={28} color={isFocused ? '#fefdff' : '#b7b4b7'}
//                 style={styles.tabButtonIcon}
//               />
//               <Text style={[styles.tabLabel, {color: isFocused ? '#fefdff' : '#b7b4b7'}]}>{route.name}</Text>
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
