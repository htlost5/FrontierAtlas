import { geoJsonMap } from "@/src/data/geojson/geojsonAssetMap";
import { expoRead } from "@/src/infra/FileSystem/expofilesystem";
import { geojsonRegistry } from "@/src/infra/geojson/geojsonRegistry";
import { parseJson } from "@/src/infra/jsonParse/jsonParser";
import type { FeatureCollection } from "geojson";

export async function getGeoDataByLogicalId(
  id: string,
): Promise<FeatureCollection> {
  // 1. メモリキャッシュを確認
  const cached = geojsonRegistry.get(id);
  if (cached) return cached;

  // 2. バンドル済みコンテンツを確認（ディスクI/O不要）
  const bundled = geoJsonMap[id]?.content;
  if (bundled) {
    geojsonRegistry.set(id, bundled);
    return bundled;
  }

  // 3. フォールバック：ディスクから読む
  const path = geoJsonMap[id]?.relativePath;
  if (!path) throw new Error(`GeoJSON not foundL ${id}`);

  const text = await expoRead("imdf/" + path);
  const parsed = parseJson(text);
  geojsonRegistry.set(id, parsed);

  return parsed;
}
