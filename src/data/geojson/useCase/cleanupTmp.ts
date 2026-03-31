import { expoAllRemove } from "@/src/infra/FileSystem/fileSystem";

export default function cleanupTmp() {
  // fs内のtmpファイルクリーンアップ
  expoAllRemove("data/imdf", ".tmp");
}
