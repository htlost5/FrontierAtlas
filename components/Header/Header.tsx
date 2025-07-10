import { Image, SafeAreaView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from 'react-native-svg';

import AccountIcon from '../../assets/images/icons/Header/circle.svg'
import FrontierAtlasLogo from '../../assets/images/startup/FrontierAtlasLogo_ver1.png'; // リネームに合わせて修正
import MenuIcon from '../../assets/images/icons/Header/Menu.svg'; // Menu.svgを直接コンポーネントとしてインポート

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={[styles.headerContainer, { paddingTop: insets.top }]}>
            <View style={styles.logoWrapper}>
                <View style={styles.accountPlaceHolder}>
                    <AccountIcon style={styles.accountStyle} fill='gray' />
                </View>
                <Image 
                    source={FrontierAtlasLogo}
                    style={styles.logoStyle}
                    resizeMode="contain"
                />
                <View style={styles.menuPlaceHolder}>
                    <MenuIcon style={styles.menuIconStyle} fill='black' />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: "white",
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#cccccc',
        position: 'relative',
    },
    accountPlaceHolder: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: 'green',   
    },
    accountStyle: {
        height: '80%',
        width: '80%',
    },
    logoWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        // borderWidth: 1,
        // // borderColor: 'purple',
    },
    logoStyle: {
        width: '90%',
        height: '90%',
    },
    menuPlaceHolder: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: 'orange',
    },
    menuIconStyle: {
        height: '75%',
        width: '75%',
    }
})

export default Header;