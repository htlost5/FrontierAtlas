// usePrepareData 用のカスタムHookを定義する。
import {
  initializeGeoData,
  checkAndUpdate,
} from "@/src/data/geojson";
import { useEffect, useState } from "react";

export default function usePrepareData(baseReady: boolean) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!baseReady) return;

    let cancelled = false;

    (async () => {
      try {
        // 1. SQLite キャッシュからの即時表示（初回はアセットからリストア）
        await initializeGeoData();
        if (!cancelled) setReady(true);

        // 2. バックグラウンドで更新チェック（起動をブロックしない）
        checkAndUpdate().then((results) => {
          const failed = results.filter((r) => r.status === "failed");
          if (failed.length > 0) {
            console.warn(
              "Partial update failures:",
              failed.map((r) => r.mapId),
            );
          }
        });
      } catch (e) {
        console.error("Failed to initialize geo data:", e);
        if (!cancelled) setReady(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [baseReady]);

  return ready;
}
