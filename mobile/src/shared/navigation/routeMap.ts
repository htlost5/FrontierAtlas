// routeMap の共有機能を定義する。
import { RouteName } from "./routes";

export const ROUTE_MAP: Record<RouteName, `/(tabs)/${RouteName}`> = {
  home: "/(tabs)/home",
  tools: "/(tabs)/tools",
  classroom: "/(tabs)/classroom",
};
