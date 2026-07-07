// マップイベント管理Hookを提供する。
import { useCallback } from "react";
import type { GeoJSON } from "geojson";

/**
 * マップの onPress イベントを処理するカスタムHook。
 * @param callback - 押下されたフィーチャーを受け取るコールバック
 * @returns マップの onPress ハンドラ
 */
export function useMapEvents(
  callback: (feature: GeoJSON.Feature) => void,
): { onPress: (e: { features?: GeoJSON.Feature[] }) => void } {
  const onPress = useCallback(
    (e: { features?: GeoJSON.Feature[] }) => {
      const feature = e?.features?.[0] as GeoJSON.Feature | undefined;
      if (feature) {
        callback(feature);
      }
    },
    [callback],
  );

  return { onPress };
}
