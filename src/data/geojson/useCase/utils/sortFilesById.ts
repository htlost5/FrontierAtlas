import { BuildManifestFiles, LocalManifestFiles } from "../../manifestType";

export function sortFilesById(
  localFiles: LocalManifestFiles,
  buildFiles: BuildManifestFiles,
): LocalManifestFiles {
  const sorted: LocalManifestFiles = {};

  for (const id of Object.keys(buildFiles)) {
    if (localFiles[id]) {
      sorted[id] = localFiles[id];
    }
  }

  return sorted;
}
