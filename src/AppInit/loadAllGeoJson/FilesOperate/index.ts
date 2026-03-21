import { atomicWrite } from "@/src/infra/FileSystem/AtomicFileSystem";
import { stringifyJson } from "@/src/infra/GeoJsonParse/geojsonParser";
import { DiffResult } from "../diff/types";
import { makeCacheManifest } from "../Manifest/makeCacheManifest";
import { Manifest } from "../Manifest/manifestType";
import { IMDF_BASE_DIR, PATHS } from "../pathConfig";
import { addFiles } from "./addFiles";
import { removeFiles } from "./removeFiles";
import { updateFiles } from "./updateFiles";

export function operateFiles(
  buildManifest: Manifest,
  cacheManifest: Manifest | null,
  diffResult: DiffResult,
): void {
  // 最優先でremoveを実行
  if (diffResult.remove) {
    removeFiles(diffResult.remove);
  }

  // 次にaddで新しいファイルを入れる
  if (diffResult.add) {
    addFiles(diffResult.add);
  }

  // 最後に更新をかけて完了
  if (diffResult.update) {
    updateFiles(diffResult.update);
  }

  // 新しいcacheManifestを作成
  const newCache = makeCacheManifest(buildManifest, cacheManifest, diffResult);

  // 永続化
  atomicWrite(IMDF_BASE_DIR + PATHS.CACHE_MANIFEST, stringifyJson(newCache));
}
