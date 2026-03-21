import { expoExists, expoRead } from "@/src/infra/FileSystem/expofilesystem";
import { parseJson } from "@/src/infra/GeoJsonParse/geojsonParser";
import { cleanupTmpFiles } from "./cleanup/cleanupTmp";
import { PATHS } from "./pathConfig";

import rawBuildManifest from "@/assets/imdf/buildManifest.json";
import { detectDiff } from "./diff";
import { operateFiles } from "./FilesOperate";
import { Manifest } from "./Manifest/manifestType";

export async function loadAllGeoJson() {
  // .tmpファイルの検出＆削除
  await cleanupTmpFiles();
  
  // Manifest定義
  const buildManifest: Manifest = rawBuildManifest;
  let cacheManifest: Manifest | null = null;

  // cacheManifestがあれば、そのデータを入れる
  if (expoExists(PATHS.CACHE_MANIFEST)) {
    const cacheManifestString = await expoRead(PATHS.CACHE_MANIFEST);
    cacheManifest = parseJson(cacheManifestString);
  }

  // 差分検出結果
  const diffResult = detectDiff(buildManifest, cacheManifest);

  // OperateFiles実行 & cacheManifest保存（or 新規作成）
  operateFiles(buildManifest, cacheManifest, diffResult);

  // 最後に.tmpを完全に削除
  await cleanupTmpFiles();
}
