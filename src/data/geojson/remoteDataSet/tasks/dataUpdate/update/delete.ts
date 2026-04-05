import { expoExists, expoRemove } from "@/src/infra/FileSystem/fileSystem";
import { MapId } from "../../../../geojsonAssetMap";
import { LocalManifest } from "../../../../manifestType";

export function remoteDataDelete(
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
