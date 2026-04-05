import type { Feature, FeatureCollection } from "geojson";

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

// assetManifest
export type AssetItem = {
  logicalId: string;
  relativePath: string;
  content: Feature | FeatureCollection;
};

export type AssetFiles = Record<string, AssetItem>;
