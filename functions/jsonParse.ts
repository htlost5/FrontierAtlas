import type { FeatureCollection } from "geojson";
import { InteractionManager } from "react-native";


export default async function parseGeoJsonAsync<T = FeatureCollection>(text: string): Promise<T> {
  return new Promise<T>((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      resolve(JSON.parse(text) as T);
    });
  });
}