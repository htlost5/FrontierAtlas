export const IMDF_BASE_DIR = "imdf/";

export const PATHS = {
  CACHE_MANIFEST: "manifests/cacheManifest.json",
  ADDRESS: "geojson/address.geojson",
  VENUE: "geojson/venue",
};

export type PathKey = (typeof PATHS)[keyof typeof PATHS];
