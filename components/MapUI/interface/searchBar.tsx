// マップ画面上部の検索バー：部屋名の入力と検索画面への遷移を管理するコンポーネント
import { router, usePathname } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useSearch } from "@/Context/SearchContext";

import { translation } from "@/functions/translation";

// 検索バー本体：フォーカス状態に応じてUI切り替えとテキスト入力を処理
export function SearchBar() {
  const pathName = usePathname();
  const focused = pathName.endsWith("/search");
  const { searchText, setSearchText, setAnswerText } = useSearch();

  console.log(pathName);

  return (
    <TouchableOpacity
      style={[
        styles.searchBox,
        {
          backgroundColor: focused ? "#E6E6E6" : "#FFFFFF",
        },
      ]}
      onPress={() => {
        if (!focused) {
          router.push("/search" as any);
        }
      }}
      activeOpacity={1}
    >
      {!focused ? (
        <>
          <View style={styles.iconWrapping}>
            <Image
              style={styles.appLogo}
              source={require("@/assets/images/appLogo/FrontierAtlasLogo_white.png")}
            />
          </View>
          <View style={styles.inputPlace}>
            <Text style={[styles.text, { color: "#000000", opacity: 0.6 }]}>
              部屋を探す
            </Text>
          </View>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.iconWrapping}
            onPress={() => router.back()}
            activeOpacity={1}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Image
              style={styles.appLogo}
              source={require("@/assets/images/icons/searchVar/back-black.png")}
            />
          </TouchableOpacity>
          <View style={styles.inputPlace}>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={async () => {
                console.log("pressed Enter");
                const converted = await translation(searchText);
                setAnswerText(converted);
              }}
              returnKeyType="search"
              placeholder="部屋を探す"
              style={[
                styles.text,
                { color: "#000000", paddingVertical: 0, paddingHorizontal: 0 },
              ]}
              autoFocus
            />
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    height: 50,
    width: 400,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    ...Platform.select({
      android: {
        elevation: 6,
      },
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
      },
      web: {
        boxShadow: "0px 4x 12px rgba(0,0,0,0.15)",
      },
    }),
  },
  iconWrapping: {
    marginLeft: 8,
    height: 34,
    width: 34,
  },
  appLogo: {
    width: "100%",
    height: "100%",
  },
  inputPlace: {
    position: "absolute",
    left: 50,
    height: "100%",
    justifyContent: "center",
  },
  text: {
    fontSize: 22,
    lineHeight: 50,
  },
});
