import { expoRead } from "@/src/infra/FileSystem/fileSystem";
import { geojsonRegistry } from "@/src/infra/geojson/geojsonRegistry";
import { parseJson } from "@/src/infra/jsonParse/jsonParser";

export async function loadGeoJson(id: string, path: string) {
  // 1. メモリをチェック
  const cached = geojsonRegistry.get(id);
  if (cached) return cached;

  // 2. ない場合ディスクから読む
  const text = await expoRead("imdf/" + path); // -> エラー場所
  // console.log(text);
  const parsed = parseJson(text);

  // 3. メモリに保存
  geojsonRegistry.set(id, parsed);

  return parsed;
}
