// useMapContext 用のカスタムHookを定義する。
import { useContext } from "react";
import { MapContext, MapContextValue } from "../../context/MapContext";

export function useMapContext(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) {
    throw new Error("useMapContext must be used within MapRoot");
  }
  return ctx;
}
