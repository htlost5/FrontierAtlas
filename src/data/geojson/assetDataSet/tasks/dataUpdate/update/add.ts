import geoJsonMap, { MapId } from "@/src/data/geojson/geojsonAssetMap";
import { BuildManifest, LocalManifest } from "@/src/data/geojson/manifestType";
import { atomicWrite } from "@/src/infra/FileSystem/fileSystem";
import { parseJson } from "@/src/infra/jsonParse/jsonParser";

export function assetDataAdd(
  addList: MapId[],
  buildManifest: BuildManifest,
  localManifest: LocalManifest,
): LocalManifest {
  for (const id of addList) {
    const baseId = buildManifest.files[id];
    const relativePath = baseId.relativePath;

    // アセットから取得
    const sourceTxt = geoJsonMap[id].content;
    const data = parseJson(sourceTxt);

    // ローカルに保存
    atomicWrite(relativePath, data);

    localManifest.files[id] = {
      relativePath: buildManifest.files[id].relativePath,
    };
  }

  return localManifest;
}
