import { cleanupTmpFiles } from "./cleanupTmp";

export async function loadAllGeoJson() {
  // .tmpファイルの検出＆削除
  await cleanupTmpFiles();

  // cacheManifest存在確認
}
