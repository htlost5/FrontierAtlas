// GeoJSON を読み込みレジストリに登録するサービスを提供する。
import type { FeatureCollection } from "geojson";
import { expoRead } from "@/src/infra/FileSystem/fileSystem";
import { geojsonRegistry } from "@/src/infra/geojson/geojsonRegistry";
import { geoJsonMap, type MapId } from "@/src/data/geojson/geojsonAssetMap";
import { parseJson } from "@/src/infra/jsonParse/jsonParser";

export async function loadGeoJson(id: string, path: string): Promise<FeatureCollection> {
  // 1. キャッシュをチェック
  const cached = await geojsonRegistry.get(id);
  if (cached) return cached;

  try {
    // 2. ファイルシステムから読み取り
    const text = await expoRead("imdf/" + path);
    const parsed = parseJson<FeatureCollection>(text);
    await geojsonRegistry.set(id, parsed);
    return parsed;
  } catch (e) {
    console.warn(`[loadGeoJson] Failed to read ${id} from filesystem, trying asset fallback:`, e);

    // 3. アセットバンドルフォールバック
    const asset = geoJsonMap[id as MapId];
    if (asset) {
      const data = asset.content as FeatureCollection;
      await geojsonRegistry.set(id, data);
      return data;
    }

    throw e;
  }
}
