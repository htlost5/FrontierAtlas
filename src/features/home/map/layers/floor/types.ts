import { GeoLayerProps } from "../../types";

export const FLOOR_KEYS = ["units", "sections"];

export type FloorProps = {
  floorData: {
    units: GeoLayerProps["data"];
    sections: GeoLayerProps["data"];
  };
  stairsData: GeoLayerProps["data"];
};
