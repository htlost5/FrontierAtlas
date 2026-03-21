import { expoAllRemove, expoRemove } from "@/src/infra/FileSystem/fileSystem";
import expoWalk from "@/src/infra/FileSystem/walk";
import { ManifestFiles } from "../manifestType";

export default function cleanupTmp(localManifest: ManifestFiles | null) {
  // fs内のtmpファイルクリーンアップ
  if (!localManifest) {
    expoAllRemove("data/imdf", ".tmp");

  } else {
    for (const path of expoWalk("data/imdf", ".tmp")) {
      const id = path.replace(/\//g, "_");

      if (localManifest[id]) {
        localManifest[id].status = "failed";
      }

      expoRemove(path);
    }
  }
}
