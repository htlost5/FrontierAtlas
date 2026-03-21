import loadAllGeoJson from "@/src/data/geojson";
import { useEffect, useState } from "react";

export default function usePrepareData(baseReady: boolean) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!baseReady) return;

    let cancelled = false;

    (async () => {
      try {
        await loadAllGeoJson();
        if (!cancelled) setReady(true);
      } catch (e) {
        console.error("Failed to load geo data:", e);
        if (!cancelled) setReady(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [baseReady]);

  return ready;
}
