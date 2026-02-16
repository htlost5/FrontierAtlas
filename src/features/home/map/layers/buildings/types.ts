import type { FeatureCollection } from "geojson";

export const BUILDING_KEYS = ["studyhall", "interact"] as const;

export type BuildingsData = Record<
  (typeof BUILDING_KEYS)[number],
  FeatureCollection | null
>;

export type BuildingsProps = {
  data: BuildingsData;
};
