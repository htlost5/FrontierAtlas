import { MapId } from "../geojsonAssetMap";
import { BuildManifest } from "../manifestType";

type FileInfo = {
  url: string;
  tmpPath: string;
  finalPath: string;
  expectedSize: number;
  expectedSha256: string;
};

export function resolveFileInfo(
  id: MapId,
  DATA_SOURCE_URL: string,
  buildManifest: BuildManifest,
): FileInfo {
  const baseId = buildManifest.files[id];
  if (!baseId) {
    throw new Error(`Manifest missing id: ${id}`);
  }

  const relativePath = baseId.relativePath;

  return {
    url: `${DATA_SOURCE_URL}/${relativePath}`,
    tmpPath: `data/imdf/${relativePath}.tmp`,
    finalPath: `data/imdf/${relativePath}`,
    expectedSize: baseId.size,
    expectedSha256: baseId.sha256,
  };
}
