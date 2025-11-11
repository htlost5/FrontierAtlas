import * as FileSystem from "expo-file-system";
import type { FeatureCollection } from "geojson";
import { InteractionManager } from "react-native";

const cacheDir = `${FileSystem.documentDirectory}geoJson_cache`;

const dirs = {
  venue: `${cacheDir}/venues`,
  studyhall: `${cacheDir}/venues`,
  interact: `${cacheDir}/venues`,
  section: `${cacheDir}/sections`,
  unit: `${cacheDir}/units/`,
  others: `${cacheDir}/others`
}

type DirKey = keyof typeof dirs;

type Props = {
  type: DirKey,
  feature: string,
}

async function parseGeoJsonAsync<T = FeatureCollection>(text: string): Promise<T> {
  return new Promise<T>((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      resolve(JSON.parse(text) as T);
    });
  });
}

export default async function loadGeoJson(targets: Props[]) {
  const tasks = targets.map(async ({type, feature}) => {
    const path = `${dirs[type]}/${feature}.geojson`;
    try {
    const text = await FileSystem.readAsStringAsync(path);
    return await parseGeoJsonAsync(text);
    } catch (e) {
      console.warn(e);
      return { type: "FeatureCollection", features: [] } as FeatureCollection;
    }
  })
  
  const parsedDatas = await Promise.all(tasks);
  return parsedDatas;
}
