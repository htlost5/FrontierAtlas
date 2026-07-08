// manifestTypes のドメイン型定義をまとめる。

// buildManifest
export type BuildManifestItem = {
  relativePath: string;
  size: number;
  sha256: string;
};

export type BuildManifestFiles = Record<string, BuildManifestItem>;

export type BuildManifest = {
  version: string;
  totalSize: number;
  files: BuildManifestFiles;
};

// localManifest
export type LocalManifestItem = {
  relativePath: string;
  size?: number;
  sha256?: string;
};

export type LocalManifestFiles = Record<string, LocalManifestItem>;

export type LocalManifest = {
  version: string | null;
  files: LocalManifestFiles;
};

// NOTE: AssetItem/AssetFiles removed (unused in current codebase)
