// routes の共有機能を定義する。
export const ROUTES = ["home", "tools", "calendar", "classroom"] as const;
export type RouteName = (typeof ROUTES)[number];
