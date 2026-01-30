import type { FeatureCollection } from "geojson";

function stringifyGeoJson(data: FeatureCollection): string {
  try {
    return JSON.stringify(data);
  } catch (e) {
    throw new Error(`Failed to stringify JSON: ${e}`);
  }
}

function parseGeoJson(data: string): FeatureCollection {
  try {
    return JSON.parse(data);
  } catch (e) {
    throw new Error(`Failed to parse JSON: ${e}`);
  }
}

export { parseGeoJson, stringifyGeoJson };

