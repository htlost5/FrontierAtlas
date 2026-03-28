import type { Feature, FeatureCollection } from "geojson";

export type AssetItem = {
  logicalId: String;
  relativePath: string;
  content: Feature | FeatureCollection;
}
export type AssetFiles = Record<string, AssetItem>;


export type ManifestItem = {
  logicalId: string;
  relativePath: string;
  sha256: string;
  size: number;
};

export type ManifestFiles = Record<string, ManifestItem>;

// buildManifest
export type Manifest = {
  version: string;
  count?: number;
  totalSize: number;
  files: ManifestFiles;
};

// // localManifest
// export type LocalManifest = {
//   version: string;
//   totalSize: number;
//   files: ManifestFiles
// }


// localManifest / buildManifestのプロパティをそれぞれ何にするか定義
// buildManifest github参照