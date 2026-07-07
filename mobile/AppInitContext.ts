import { createContext } from "react";

export const AppInitContext = createContext<{ cacheReady: boolean }>({
  cacheReady: false,
});
