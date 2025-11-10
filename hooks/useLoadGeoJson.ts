import { useEffect, useState } from "react";

import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import type { FeatureCollection } from "geojson";

export default function useLoadGeoJson(originGeoJson: any) {
  const [geoJsonList, setGeoJsonList] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const asset = Asset.fromModule(originGeoJson);
        await asset.downloadAsync();
        const text = await FileSystem.readAsStringAsync(asset.localUri!);
        const geojson = JSON.parse(text) as FeatureCollection;
        setGeoJsonList(geojson);
      } catch (e: any) {
        console.error(e);        
    }
  }
    loadAll();
  }, [originGeoJson]);

  return { geoJsonList };
}
