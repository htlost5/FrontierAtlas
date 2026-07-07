// updateDetect のGeoJSONデータ処理を定義する。
import { MapId } from "../../../geojsonAssetMap";
import {
  BuildManifestFiles,
  LocalManifestFiles
} from "../../../manifestType";

export function updateDetect(
  buildFiles: BuildManifestFiles,
  localFiles: LocalManifestFiles,
): MapId[] {
  const updateList: MapId[] = [];

  const buildIds = Object.keys(buildFiles) as MapId[];
  const localIds = Object.keys(localFiles) as MapId[];

  const intersection = localIds.filter((id) => buildIds.includes(id));

  for (const item of intersection) {
    // size検証
    if (localFiles[item].size !== buildFiles[item].size) {
      updateList.push(item);
    } else if (localFiles[item].sha256 !== buildFiles[item].sha256) {
      updateList.push(item);
    }
  }

  return updateList;
}

// build localともに、ファイル・id・sha256の保証
// statusに関して自己修復システムの構築
