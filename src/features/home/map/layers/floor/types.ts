import type { FeatureCollection } from "geojson";

export const FLOOR_KEYS = ["units", "sections"];

export type FloorData = FeatureCollection | null;

export type FloorProps = {
  data: {
    units: FloorData;
    sections: FloorData;
  };
};
