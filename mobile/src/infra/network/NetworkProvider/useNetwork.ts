// useNetwork のインフラ層実装を提供する。
import { useContext } from "react";
import { NetworkContext } from "./NetworkProvider";

export function useNetwork() {
  const context = useContext(NetworkContext);

  if (!context) {
    throw new Error("useNetwork must be used with in NetworkProvider");
  }

  return context;
}
