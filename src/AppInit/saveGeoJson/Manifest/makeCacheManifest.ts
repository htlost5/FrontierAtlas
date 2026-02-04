// cacheManifestの新規作成
// buildのバージョン
// updated
// count
// files -> buildと全く一緒

import { DiffResult } from "../diff/types";
import { Manifest, ManifestFileEnrty } from "./manifestType";

export function makeCacheManifest(
  buildManifest: Manifest,
  cacheManifest: Manifest | null,
  diffResult: DiffResult,
): Manifest {
  // 1. ベースとなるfilesマップを設定
  // cacheがなければ空、あればcache.filesをコピー
  const resultFiles: Record<string, ManifestFileEnrty> = cacheManifest
    ? { ...cacheManifest.files }
    : {};

  // 2. removeを反映（logicalIdをキーとして削除）
  if (diffResult.remove) {
    for (const f of diffResult.remove) {
      delete resultFiles[f.logicalId];
    }
  }

  // 3. add / update を反映
  const applyList = [...(diffResult.add ?? []), ...(diffResult.update ?? [])];

  for (const f of applyList) {
    const src = buildManifest.files[f.logicalId];
    if (!src) {
      continue;
    }

    // buildManifestのメタ情報を採用
    resultFiles[f.logicalId] = {
      logicalId: src.logicalId,
      relativePath: src.relativePath,
      size: src.size,
      version: src.version,
    } as ManifestFileEnrty;
  }

  // メタ情報の組み立て
  const now = new Date().toISOString();

  const out: Manifest = {
    version: buildManifest.version,
    created: cacheManifest?.created ?? now,
    updated: now,
    generated_by: cacheManifest?.generated_by ?? "app",
    count: Object.keys(resultFiles).length,
    files: resultFiles,
  };

  return out;
}
