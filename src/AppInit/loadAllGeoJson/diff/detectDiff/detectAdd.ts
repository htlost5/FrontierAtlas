import { DiffFile, OperateFile } from "../types";

// 不足の検出
export function detectAdd(build: DiffFile[], cache: DiffFile[]): OperateFile[] {
  const cacheIdSet = new Set(cache.map((f) => f.logicalId));
  const addList: OperateFile[] = [];

  for (const { logicalId, relativePath } of build) {
    if (!cacheIdSet.has(logicalId)) {
      addList.push({ logicalId, relativePath });
    }
  }

  return addList;
}
