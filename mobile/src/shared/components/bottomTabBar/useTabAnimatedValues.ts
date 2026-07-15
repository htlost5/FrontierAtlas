// animated values用hook
import React from "react";
import { Animated } from "react-native";

import { ROUTES } from "../../navigation/routes";

export function useTabAnimatedValues() {
  const [values] = React.useState<Animated.Value[]>(() =>
    ROUTES.map(() => new Animated.Value(0)),
  );
  return values;
}
