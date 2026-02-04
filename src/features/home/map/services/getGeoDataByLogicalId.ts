import { geoJsonMap } from "@/src/AppInit/saveGeoJson/geojsonAssetMap";
import type { FeatureCollection } from "geojson";
import { loadGeoJson } from "./loadGeoJson";

export async function getGeoDataByLogicalId(id: string): Promise<FeatureCollection> {
  // パス解決 id -> path
  const path = geoJsonMap[id]?.relativePath;

  // id, path から geoData取得
  const GeoData = await loadGeoJson(id, path);

  return GeoData;
}
