import { basePath } from "@/src/data/paths";
import { expoAllRemove } from "@/src/infra/FileSystem/fileSystem";

export default function cleanupTmp() {
  // fs内のtmpファイルクリーンアップ
  expoAllRemove(basePath, ".tmp");
}
