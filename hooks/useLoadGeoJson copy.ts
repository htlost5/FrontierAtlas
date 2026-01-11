/**
 * GeoJSONファイルを非同期に読み込むReactフック
 * 複数のGeoJSONアセットをロードして配列として返す
 */
import { useEffect, useState } from "react";

import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import type { FeatureCollection } from "geojson";

/**
 * GeoJSONファイルをロードするカスタムフック
 * @param originGeoJsons - ロードするGeoJSONアセット（可変長引数）
 * @returns ロードしたGeoJSON配列、ローディング状態、エラー情報
 */
export function useLoadGeoJson(...originGeoJsons: any) {
  const [geoJsonList, setGeoJsonList] = useState<FeatureCollection[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      try {
        const results: FeatureCollection[] = [];

        for (const origin of originGeoJsons) {
          const asset = Asset.fromModule(origin);
          await asset.downloadAsync();
          const text = await FileSystem.readAsStringAsync(asset.localUri!);
          const geojson = JSON.parse(text) as FeatureCollection;
          results.push(geojson);
        }
        setGeoJsonList(results);
      } catch (e: any) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [originGeoJsons]);

  return { geoJsonList, loading, error };
}
