import { loadAllGeoJson } from "@/src/data/geojson";
import { basePath } from "@/src/data/paths";
import expoWalk from "@/src/infra/FileSystem/walk";
import { useNetwork } from "@/src/infra/network/NetworkProvider/useNetwork";
import { useEffect, useState } from "react";

export type DataSource = "remote" | "asset";

export default function usePrepareData(baseReady: boolean) {
  const [ready, setReady] = useState(false);

  const { isOffline } = useNetwork();
  const [geoDataSource, setGeoDataSource] = useState<DataSource>();

  useEffect(() => {
    if (!baseReady) return;

    console.log(`files: ${expoWalk(basePath)}`);

    let cancelled = false;

    (async () => {
      try {
        await loadAllGeoJson(isOffline, setGeoDataSource);
        if (!cancelled) setReady(true);
      } catch (e) {
        console.error("Failed to load geo data:", e);
        if (!cancelled) setReady(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [baseReady, isOffline]);

  return ready;
}
