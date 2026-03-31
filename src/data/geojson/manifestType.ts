import type { Feature, FeatureCollection } from "geojson";

// 共通 ManifestItem
export type ManifestItem = {
  relativePath: string;
  size: number;
  sha256: string;
};

// buildManifest
export type BuildManifestFiles = Record<string, ManifestItem>;

export type BuildManifest = {
  version: string;
  totalSize: number;
  files: BuildManifestFiles;
};

// localManifest
export type LocalManifestFiles = Record<string, ManifestItem>;

export type LocalManifest = {
  version: string;
  files: LocalManifestFiles;
};

// assetManifest
export type AssetItem = {
  logicalId: string;
  relativePath: string;
  content: Feature | FeatureCollection;
};

export type AssetFiles = Record<string, AssetItem>;
