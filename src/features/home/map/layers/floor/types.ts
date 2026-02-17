import { GeoLayerProps } from "../../types";

export const FLOOR_KEYS = ["units", "sections"];

export type FloorProps = {
  data: {
    units: GeoLayerProps["data"];
    sections: GeoLayerProps["data"];
    stairs: GeoLayerProps["data"];
  };
};
