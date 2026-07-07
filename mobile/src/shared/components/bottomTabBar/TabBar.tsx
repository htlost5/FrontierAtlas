// presentational（pure）
import { View } from "react-native";

import { RouteName, ROUTES } from "../../navigation/routes";
import { styles } from "./styles";
import { TAB_ICONS } from "./tabIcons";
import { TabItem } from "./TabItem";

type Props = {
  focusedRoute: RouteName;
  onPressComplete: (name: RouteName) => void | Promise<void>;
  animatedValues?: any[];
};

export function TabBar({ focusedRoute, onPressComplete, animatedValues }: Props) {
  return (
    <View style={styles.tabBar}>
      {ROUTES.map((r, idx) => {
        const { lib, name } = TAB_ICONS[r];
        return (
          <TabItem
            key={r}
            name={r}
            Icon={lib}
            iconName={name}
            isFocused={focusedRoute === r}
            onPressComplete={onPressComplete}
            animatedValue={animatedValues?.[idx]}
          />
        );
      })}
    </View>
  );
}
