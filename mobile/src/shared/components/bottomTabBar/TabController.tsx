// container（useRouter, usePathname, onPress）

import { usePathname, useRouter } from "expo-router";
import React from "react";

import { ROUTE_MAP } from "../../navigation/routeMap";
import { RouteName, ROUTES } from "../../navigation/routes";
import { launchApp } from "../../services/launchExternalApp";
import { useTabAnimatedValues } from "./useTabAnimatedValues";

import { TabBar } from "./TabBar";

export type BottomTabsProps = {
  isVisible: boolean;
};

export function TabController({ isVisible }: BottomTabsProps) {
  const router = useRouter();
  const pathname = usePathname() ?? ROUTE_MAP.home;
  const animatedValues = useTabAnimatedValues();

  const computeFocused = React.useCallback((): RouteName => {
    if (pathname.endsWith("/home") || pathname === "/(tabs)/home")
      return "home";
    for (const r of ROUTES) {
      if (pathname.endsWith(`/${r}`)) return r as RouteName;
    }
    return "home";
  }, [pathname]);

  const focused = computeFocused();

  const handleAfterAnimation = React.useCallback(
    async (name: RouteName) => {
      if (name === "classroom") {
        console.log("classroom pressed! -> launch after animation")
        await launchApp("classroom");
        return;
      }
      if (name !== focused) {
        router.push(ROUTE_MAP[name]);
      }
    },
    [focused, router],
  );

  if (!isVisible) return null;
  return (
    <TabBar
      focusedRoute={focused}
      onPressComplete={handleAfterAnimation}
      animatedValues={animatedValues}
    />
  );
}
