// import { Image, SafeAreaView, StyleSheet, View } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// import AccountIcon from '../../assets/images/icons/Header/circle.svg';
// import MenuIcon from '../../assets/images/icons/Header/Menu.svg'; // Menu.svgを直接コンポーネントとしてインポート
// import FrontierAtlasLogo from '../../assets/images/appLogo/FrontierAtlasLogo_white.png'; // リネームに合わせて修正

// interface HeaderProps {}

// const Header: React.FC<HeaderProps> = () => {

//     return (
//         <View style={[styles.headerContainer]}>
//             <View style={styles.logoWrapper}>
//                 <View style={styles.accountPlaceHolder}>
//                     <AccountIcon style={styles.accountStyle} fill='gray' />
//                 </View>
//                 <Image 
//                     source={FrontierAtlasLogo}
//                     style={styles.logoStyle}
//                     resizeMode="contain"
//                 />
//                 <View style={styles.menuPlaceHolder}>
//                     <MenuIcon style={styles.menuIconStyle} fill='black' />
//                 </View>
//             </View>
//         </View>
//     )
// }

// const account_size = '80%';

// const styles = StyleSheet.create({
//     headerContainer: {
//         backgroundColor: "white",
//         height: 50,
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderBottomWidth: StyleSheet.hairlineWidth,
//         borderBottomColor: '#000000',
//         position: 'relative',
//     },
//     accountPlaceHolder: {
//         position: 'absolute',
//         left: 0,
//         top: 0,
//         bottom: 0,
//         width: 50,
//         justifyContent: 'center',
//         alignItems: 'center',
//         // borderWidth: 1,
//         // borderColor: 'green',
//     },
//     accountStyle: {
//         height: '80%',
//         width: '80%',
//     },
//     logoWrapper: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         position: 'relative',
//         // borderWidth: 1,
//         // borderColor: 'purple',
//     },
//     logoStyle: {
//         width: account_size || '80%',
//         height: account_size || '80%',
//     },
//     menuPlaceHolder: {
//         position: 'absolute',
//         right: 0,
//         top: 0,
//         bottom: 0,
//         width: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         // borderWidth: 1,
//         // borderColor: 'orange',
//     },
//     menuIconStyle: {
//         height: '75%',
//         width: '75%',
//     }
// })

// export default Header;