import { expoExists, expoRead } from "@/src/infra/FileSystem/expofilesystem";
import { cleanupTmpFiles } from "./cleanupTmp";
import { lackListMake } from "./lackListMaker";
import { PATHS } from "./pathConfig";

export async function loadAllGeoJson() {
  // .tmpファイルの検出＆削除
  await cleanupTmpFiles();

  // cacheManifest定義
  let cacheManifestData = "";

  // cacheManifestがあれば、そのデータを入れる
  if (expoExists(PATHS.CACHE_MANIFEST)) {
    cacheManifestData = await expoRead(PATHS.CACHE_MANIFEST);
  }

  // cacheManifestから不足分リストを作成
  const lackList = lackListMake(cacheManifestData);
}
