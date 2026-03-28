import { expoExists, expoRemove } from "@/src/infra/FileSystem/fileSystem";
import { MapId } from "../../../geojsonAssetMap";
import { Manifest } from "../../../manifestType";

export function dataDelete(deleteList: MapId[], buildManifest: Manifest) {
  for (const id of deleteList) {
    const baseId = buildManifest.files[id];
    if (!baseId) continue;

    const relativePath = baseId.relativePath;
    const TARGET_PATH = `data/imdf/${relativePath}`;

    if (expoExists(TARGET_PATH)) {
        expoRemove(TARGET_PATH);
    }
  }
}
