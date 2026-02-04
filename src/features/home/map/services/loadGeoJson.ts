import { expoRead } from "@/src/infra/FileSystem/expofilesystem";
import { parseJson } from "@/src/infra/GeoJsonParse/geojsonParser";
import { geojsonRegistry } from "@/src/infra/geojson/geojsonRegistry";

export async function loadGeoJson(id: string, path: string) {
  // 1. メモリをチェック
  const cached = geojsonRegistry.get(id);
  if (cached) return cached;

  // 2. ない場合ディスクから読む
  const text = await expoRead(path);
  const parsed = parseJson(text);

  // 3. メモリに保存
  geojsonRegistry.set(id, parsed);

  return parsed;
}