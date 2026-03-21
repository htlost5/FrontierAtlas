
export type ManifestItem = {
  logicalId: string;
  relativePath: string;
  sha256: string;
  size: number;
  status?: string;
};

// assetMap
export type ManifestFiles = Record<string, ManifestItem>;

// buildManifest
export type Manifest = {
  version: string;
  count: number;
  files: ManifestFiles;
};
