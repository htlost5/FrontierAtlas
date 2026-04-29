// レジストリから GeoJSON を取得するサービスを提供する。
import { MapId } from "@/src/data/geojson/geojsonAssetMap";
import { geojsonRegistry } from "@/src/infra/geojson/geojsonRegistry";
import type { FeatureCollection } from "geojson";

export async function getGeoDataByLogicalId(
  id: MapId,
): Promise<FeatureCollection> {
  if (!geojsonRegistry.has(id)) {
    throw new Error(`Not found ${id} in registry`)
  }
  
  const data = geojsonRegistry.get(id);
  
  if (!data) {
    throw new Error(`Failed to get ${id} from registry`)
  }

  return data;
}
