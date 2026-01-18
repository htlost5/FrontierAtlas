// 個別タブ（アニメーション責務）

import { IconProps } from "@expo/vector-icons/build/createIconSet";
import React from "react";
import { Animated, TouchableOpacity } from "react-native";
import { RouteName } from "../../navigation/routes";

type Props = {
  name: RouteName;
  Icon: React.ComponentType<IconProps<any>>;
  iconName: string;
  isFocused: boolean;
  onPressComplete?: (name: RouteName) => void | Promise<void>;
  animatedValue?: Animated.Value;
};

export const TabItem = React.memo(function TabItem({
  name,
  Icon,
  iconName,
  isFocused,
  onPressComplete,
  animatedValue,
}: Props) {
  const anim = React.useRef(animatedValue ?? new Animated.Value(0)).current;

  const animatePress = React.useCallback(() => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 100,
        duration: 75,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 0,
        duration: 75,
        useNativeDriver: true,
      }),
    ]).start();
  }, [anim]);

  const handlePress = React.useCallback(async () => {
    await animatePress();
    if (onPressComplete) {
      await onPressComplete(name);
    }
  }, [animatePress, name, onPressComplete]);

  const iconScale = anim.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.92, 0.85],
  });
  const textScale = anim.interpolate({
    inputRange: [0, 60, 100],
    outputRange: [1, 0.95, 0.9],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={{ flex: 1, alignItems: "center" }}
      accessibilityRole="button"
      accessibilityLabel={name}
    >
      <Animated.View
        style={{
          transform: [{ scale: iconScale }],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={iconName} size={26} color={isFocused ? "blue" : "gray"} />
      </Animated.View>
      <Animated.Text
        style={{
          transform: [{ scale: textScale }],
          fontSize: 10,
          color: isFocused ? "blue" : "gray",
        }}
      >
        {name}
      </Animated.Text>
    </TouchableOpacity>
  );
});
