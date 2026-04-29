// delete のGeoJSONデータ処理を定義する。
import { MapId } from "@/src/data/geojson/geojsonAssetMap";
import { LocalManifest } from "@/src/data/geojson/manifestType";
import { expoExists, expoRemove } from "@/src/infra/FileSystem/fileSystem";

export function assetDataDelete(
  deleteList: MapId[],
  localManifest: LocalManifest,
): LocalManifest {
  for (const id of deleteList) {
    const baseId = localManifest.files[id];
    if (!baseId) continue;

    const relativePath = baseId.relativePath;

    if (expoExists(relativePath)) {
      expoRemove(relativePath);
    }

    delete localManifest.files[id];
  }

  return localManifest;
}
