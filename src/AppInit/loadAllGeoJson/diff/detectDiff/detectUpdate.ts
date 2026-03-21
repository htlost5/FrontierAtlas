import { DiffFile, OperateFile } from "../types";

// versionの一致 及び sizeの一致
export function detectUpdate(
  build: DiffFile[],
  cache: DiffFile[],
): OperateFile[] {
  const cacheMap = new Map(cache.map((f) => [f.logicalId, f]));

  const updateList: OperateFile[] = [];

  for (const b of build) {
    const c = cacheMap.get(b.logicalId);
    if (c && (b.version !== c.version || b.size !== c.size)) {
      updateList.push({
        logicalId: b.logicalId,
        relativePath: b.relativePath,
      });
    }
  }

  return updateList;
}
