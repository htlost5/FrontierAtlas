import { DiffFile, OperateFile } from "../types";

export function detectRemove(
  build: DiffFile[],
  cache: DiffFile[],
): OperateFile[] {
  const buildIdSet = new Set(build.map((f) => f.logicalId));
  const removeList: OperateFile[] = [];

  for (const { logicalId, relativePath } of cache) {
    if (!buildIdSet.has(logicalId)) {
      removeList.push({ logicalId, relativePath });
    }
  }

  return removeList;
}
