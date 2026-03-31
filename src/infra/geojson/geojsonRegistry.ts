import type { FeatureCollection } from "geojson";

export const registry = new Map<string, FeatureCollection>();

export const geojsonRegistry = {
  get(id: string): FeatureCollection | undefined {
    return registry.get(id);
  },

  set(id: string, data: FeatureCollection) {
    registry.set(id, data);
  },

  has(id: string): boolean {
    return registry.has(id);
  },

  delete(id: string) {
    registry.delete(id);
  },

  clear() {
    registry.clear();
  },
};
