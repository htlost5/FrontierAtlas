// アプリ下部のタブバー（Home, Tools, Calendar, Classroom）を描画し、ルート遷移とアニメーションを管理するコンポーネント
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { startActivityAsync } from "expo-intent-launcher";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// 各タブのアイコンライブラリとアイコン名の対応表
const icons: Record<string, { lib: any; name: string }> = {
  home: { lib: Feather, name: "home" },
  tools: { lib: Entypo, name: "tools" },
  calendar: { lib: Entypo, name: "calendar" },
  classroom: { lib: MaterialCommunityIcons, name: "google-classroom" },
};

const ANDROID_PACKAGES = {
  classroom: "classroom.google.com",
};

const appURLs = {
  classroom: "https://classroom.google.com/",
};

// タブ名と実際のルートパスのマッピング
const ROUTE_MAP = {
  home: "/",
  tools: "/(tabs)/tools",
  calendar: "/(tabs)/calendar",
  classroom: "/(tabs)/classroom",
} as const;

// ルート配列：UI は変えないのでここで固定
const ROUTES = ["home", "tools", "calendar", "classroom"] as const;

// ルート名の型定義
type RouteName = (typeof ROUTES)[number];
// "home" | "tools" | "calendar" | "classroom"

// カスタムタブバー本体：ルート遷移、フォーカス判定、タップアニメーションを実装
export default function SelfBottomTabs() {
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  // animated values をルート数で管理（UIは変更しない）
  const animatedValuesRef = React.useRef<Animated.Value[]>(
    ROUTES.map(() => new Animated.Value(0))
  );

  React.useEffect(() => {
    if (animatedValuesRef.current.length !== ROUTES.length) {
      animatedValuesRef.current = ROUTES.map(() => new Animated.Value(0));
    }
  }, []);

  // pathname によってフォーカス判定（home は "/" も許容）
  const isRouteFocused = (name: RouteName) => {
    if (name === "home") {
      return pathname === "/" || pathname.endsWith("/index");
    }
    return pathname === `/${name}` || pathname.endsWith(`/${name}`);
  };

  const buttonSizeDown = (animatedValue: Animated.Value): Promise<void> => {
    return new Promise((resolve) => {
      Animated.timing(animatedValue, {
        toValue: 100,
        duration: 75,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        resolve();
      }, 75);
    });
  };

  const buttonSizeUp = (animatedValue: Animated.Value): Promise<void> => {
    return new Promise((resolve) => {
      buttonSizeDown(animatedValue).finally(() => {
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 75,
          useNativeDriver: true,
        }).start();
        setTimeout(() => {
          resolve();
        }, 75);
      });
    });
  };

  const handlePress = async (name: RouteName, index: number) => {
    const animatedValue = animatedValuesRef.current[index];
    // アニメーションは元のまま
    buttonSizeUp(animatedValue).finally(async () => {
      if (name === "classroom") {
        try {
          await startActivityAsync("android.intent.MAIN", {
            packageName: ANDROID_PACKAGES.classroom,
          });
        } catch (e) {
          console.log(e);
          Linking.openURL(appURLs.classroom);
        }
        return;
      }

      // フォーカス済みなら何もしない（元の挙動を模倣）
      if (!isRouteFocused(name)) {
        // expo-router による遷移（タブ内部ではなくルート遷移）
        // ここで /home 等のパスに push する
        const path = ROUTE_MAP[name];
        router.push(path);
      }
    });
  };

  return (
    <View style={styles.tabBar}>
      {ROUTES.map((routeName, index) => {
        const animatedValue = animatedValuesRef.current[index];
        const iconScale = animatedValue.interpolate({
          inputRange: [0, 60, 100],
          outputRange: [1, 0.92, 0.85],
        });

        const textScale = animatedValue.interpolate({
          inputRange: [0, 60, 100],
          outputRange: [1, 0.95, 0.9],
        });

        const isFocused = isRouteFocused(routeName);
        const IconComponent = icons[routeName].lib;
        const iconName = icons[routeName].name;

        return (
          <TouchableOpacity
            key={`${routeName}-tab`}
            onPress={() => handlePress(routeName, index)}
            activeOpacity={1.0}
            style={{ flex: 1, alignItems: "center" }}
          >
            <Animated.View
              style={{
                transform: [{ scale: iconScale }],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconComponent
                name={iconName}
                size={26}
                color={isFocused ? "blue" : "gray"}
              />
            </Animated.View>
            <Animated.Text
              style={[
                styles.textStyle,
                {
                  color: isFocused ? "blue" : "gray",
                  transform: [{ scale: textScale }],
                },
              ]}
            >
              {routeName}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "white",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#CCCCCC",
  },
  textStyle: {
    color: "#000000",
    fontSize: 10,
  },
});
