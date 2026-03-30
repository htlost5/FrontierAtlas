import { expoRead } from "@/src/infra/FileSystem/fileSystem";
import { geojsonRegistry } from "@/src/infra/geojson/geojsonRegistry";
import { parseJson } from "@/src/infra/jsonParse/jsonParser";
import { Manifest } from "../../manifestType";

export async function updateRegistry(buildManifest: Manifest) {
  // 1. registryのデータクリア
  geojsonRegistry.clear();

  // 全データ再登録
  const baseFiles = buildManifest.files;
  const ids = Object.keys(baseFiles);
  for (const id of ids) {
    // 今後、try catch でデータがない場合の実装
    const sourceTxt = await expoRead(`data/imdf/${baseFiles[id].relativePath}`);
    const data = parseJson(sourceTxt);
    
    geojsonRegistry.set(`data/imdf${baseFiles[id].relativePath}`, data);
  }
}
