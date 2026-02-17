import { GeoLayerProps } from "../../types";

export const BUILDING_KEYS = ["studyhall", "interact"] as const;

export type BuildingsData = Record<
  (typeof BUILDING_KEYS)[number],
  GeoLayerProps["data"]
>;

export type BuildingsProps = {
  data: BuildingsData;
  visible: GeoLayerProps["visible"]
};
