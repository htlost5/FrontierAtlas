import { Manifest } from "../Manifest/manifestType";
import { detectAdd } from "./detectDiff/detectAdd";
import { detectRemove } from "./detectDiff/detectRemove";
import { detectUpdate } from "./detectDiff/detectUpdate";
import { buildToDiffFiles, buildToOperateFiles, fullReset } from "./helpers";
import { DiffResult } from "./types";

// jsonをdiff検出で必要となるlogicalId, version, sizeのみにする
export function detectDiff(
  build: Manifest,
  cache: Manifest | null,
): DiffResult {
  // cacheがなかったら全てadd
  if (!cache) {
    return {
      add: buildToOperateFiles(build),
      remove: [],
      update: [],
    };
  }

  // バージョン不一致 -> すべて削除＆ロード
  if (build.version !== cache.version) {
    return fullReset(build, cache);
  }

  const buildDiff = buildToDiffFiles(build);
  const cacheDiff = buildToDiffFiles(cache);

  // 上2つをクリア -> fileベースの検査
  return {
    add: detectAdd(buildDiff, cacheDiff),
    remove: detectRemove(buildDiff, cacheDiff),
    update: detectUpdate(buildDiff, cacheDiff),
  };
}
