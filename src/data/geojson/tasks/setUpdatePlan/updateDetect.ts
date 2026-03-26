import { ManifestFiles } from "../../manifestType";

export function updateDetect(
  buildFiles: ManifestFiles,
  localFiles: ManifestFiles,
): string[] {
  const updateList: string[] = [];

  const buildIds = Object.keys(buildFiles);
  const localIds = Object.keys(localFiles);

  const intersection = localIds.filter(id => buildIds.includes(id));

  

  return updateList;
}

// build localともに、ファイル・id・sha256の保証
// statusに関して自己修復システムの構築
