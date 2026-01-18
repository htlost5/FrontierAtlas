// タブアイコンの設定
// bottomTabBar以外で利用する場合があればbottomTabBarファイルから出すこと

import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import { RouteName } from "../../navigation/routes";

type IconDef = {
  lib: React.ComponentType<IconProps<any>>;
  name: string;
};

export const TAB_ICONS: Record<RouteName, IconDef> = {
  home: { lib: Feather, name: "home" },
  tools: { lib: Entypo, name: "tools" },
  calendar: { lib: Entypo, name: "calendar" },
  classroom: { lib: MaterialCommunityIcons, name: "google-classroom" },
};
