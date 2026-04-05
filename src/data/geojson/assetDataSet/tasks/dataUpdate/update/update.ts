import geoJsonMap, { MapId } from "@/src/data/geojson/geojsonAssetMap";
import { BuildManifest, LocalManifest } from "@/src/data/geojson/manifestType";
import { atomicWrite } from "@/src/infra/FileSystem/fileSystem";
import { parseJson, stringifyJson } from "@/src/infra/jsonParse/jsonParser";

export function assetDataUpdate(
  updateList: MapId[],
  buildManifest: BuildManifest,
  localManifest: LocalManifest,
): LocalManifest {
  for (const id of updateList) {
    const baseId = buildManifest.files[id];
    const relativePath = baseId.relativePath;

    // アセット取得
    const data = geoJsonMap[id].content;
    const dataTxt = stringifyJson(data);

    // ローカルに保存
    atomicWrite(relativePath, dataTxt);

    localManifest.files[id] = {
      relativePath: baseId.relativePath,
    };
  }

  return localManifest;
}
