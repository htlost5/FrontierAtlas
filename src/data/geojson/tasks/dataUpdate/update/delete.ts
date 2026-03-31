import { expoExists, expoRemove } from "@/src/infra/FileSystem/fileSystem";
import { MapId } from "../../../geojsonAssetMap";
import { BuildManifest, LocalManifest } from "../../../manifestType";

export function dataDelete(
  deleteList: MapId[],
  buildManifest: BuildManifest,
  localManifest: LocalManifest,
): LocalManifest {
  for (const id of deleteList) {
    const baseId = localManifest.files[id];
    if (!baseId) continue;

    const relativePath = baseId.relativePath;
    const TARGET_PATH = `data/imdf/${relativePath}`;

    if (expoExists(TARGET_PATH)) {
      expoRemove(TARGET_PATH);
    }

    delete localManifest.files[id];
  }

  return localManifest;
}
