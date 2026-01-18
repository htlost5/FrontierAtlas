export const ROUTES = ["home", "tools", "calendar", "classroom"] as const;
export type RouteName = (typeof ROUTES)[number];
