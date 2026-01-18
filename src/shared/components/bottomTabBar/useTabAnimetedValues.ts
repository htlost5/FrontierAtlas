// animated values用hook
import React from "react";
import { Animated } from "react-native";

import { ROUTES } from "../../navigation/routes";

export function useTabAnimatedValues() {
  const ref = React.useRef<Animated.Value[]>(
    ROUTES.map(() => new Animated.Value(0)),
  );

  React.useEffect(() => {
    if (ref.current.length !== ROUTES.length) {
      ref.current = ROUTES.map(() => new Animated.Value(0));
    }
  }, []);

  return ref.current;
}
