import type { FeatureCollection } from "geojson";

type FloorCache = Record<
  number,
  {
    section: FeatureCollection;
    unit: FeatureCollection;
    stair: FeatureCollection;
  }
>;

type VenueCache = {
  venue?: FeatureCollection;
  studyhall?: FeatureCollection;
  Interact?: FeatureCollection;
};

const floorCache: FloorCache = {};
let venueCache: VenueCache | null = null;

// floorCache関係のhooks
export function hasFloorCache(floor: number) {
  return !!floorCache[floor];
}
export function getFloorCache(floor: number) {
  return floorCache[floor];
}
export function setFloorCache(floor: number, data: FloorCache[number]) {
  floorCache[floor] = data;
}

// venueCache関係のhooks
export function hasVenueCache() {
  return !!venueCache; // なかったらtrueを返す（二重否定演算子）
}
export function getVenueCache(): VenueCache | null {
  return venueCache;
}
export function setVenueCache(data: VenueCache) {
  venueCache = data;
}
