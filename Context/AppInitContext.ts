import { createContext } from "react";

export const AppInitContext = createContext<{ ready: boolean }>({
  ready: false,
});
