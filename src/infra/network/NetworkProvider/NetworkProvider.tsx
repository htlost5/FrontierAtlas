// NetworkProvider のインフラ層実装を提供する。
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import React, { createContext, useEffect, useMemo, useState } from "react";

export type NetworkState = {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  isOffline: boolean;
  isOnline: boolean;
  isWifi: boolean;
  isExpensive: boolean;
  shouldSync: boolean;
};

export const NetworkContext = createContext<NetworkState | null>(null);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [netInfo, setNetInfo] = useState<NetInfoState | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfo(state);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo<NetworkState>(() => {
    const isConnected = netInfo?.isConnected ?? null;
    const isInternetReachable = netInfo?.isInternetReachable ?? null;

    const isOffline = !isConnected || isInternetReachable === false;

    const isOnline = isConnected || isInternetReachable !== false;

    const isWifi = netInfo?.type === "wifi";
    const isExpensive = netInfo?.details?.isConnectionExpensive ?? false;

    const shouldSync = isOnline && !isExpensive;

    return {
      isConnected,
      isInternetReachable,
      isOffline,
      isOnline,
      isWifi,
      isExpensive,
      shouldSync,
    };
  }, [netInfo]);

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
}
