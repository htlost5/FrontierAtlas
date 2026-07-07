// レジストリから GeoJSON を取得するサービスを提供する。
import { MapId } from "@/src/data/geojson/geojsonAssetMap";
import { geojsonRegistry } from "@/src/infra/geojson/geojsonRegistry";
import { geoJsonMap } from "@/src/data/geojson/geojsonAssetMap";
import type { FeatureCollection } from "geojson";

export async function getGeoDataByLogicalId(
  id: MapId,
): Promise<FeatureCollection> {
  // 1. SQLite キャッシュ確認
  const has = await geojsonRegistry.has(id);
  if (has) {
    const data = await geojsonRegistry.get(id);
    if (data) return data;
  }

  // 2. アセットバンドルフォールバック
  const asset = geoJsonMap[id];
  if (asset) {
    const data = asset.content as FeatureCollection;
    await geojsonRegistry.set(id, data);
    return data;
  }

  throw new Error(`Not found ${id} in registry or assets`);
}
