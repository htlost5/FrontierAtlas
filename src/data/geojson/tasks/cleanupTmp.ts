import { expoAllRemove } from "@/src/infra/FileSystem/fileSystem";
import { Manifest } from "../manifestType";

export default function cleanupTmp(localManifest: Manifest | null) {
  // fs内のtmpファイルクリーンアップ
  expoAllRemove("data/imdf", ".tmp");
}
