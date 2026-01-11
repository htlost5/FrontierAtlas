// キャッシュディレクトリからGeoJSONファイルを読み込むユーティリティ関数
import * as FileSystem from "expo-file-system";
import type { FeatureCollection } from "geojson";
import { InteractionManager } from "react-native";

// キャッシュディレクトリのルートパス
const cacheDir = `${FileSystem.documentDirectory}geoJson_cache`;

// 各データタイプごとのキャッシュディレクトリパス
const dirs = {
  venue: `${cacheDir}/venues`,
  studyhall: `${cacheDir}/venues`,
  interact: `${cacheDir}/venues`,
  section: `${cacheDir}/sections`,
  unit: `${cacheDir}/units/`,
  others: `${cacheDir}/others`,
};

// ディレクトリキーの型
type DirKey = keyof typeof dirs;

// GeoJSON読み込みリクエストのパラメータ型
type Props = {
  type: DirKey;
  feature: string;
};

// JSONパースをInteractionManagerで非同期化し、UIブロックを回避
async function parseGeoJsonAsync<T = FeatureCollection>(
  text: string
): Promise<T> {
  return new Promise<T>((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      resolve(JSON.parse(text) as T);
    });
  });
}

// 複数のGeoJSONファイルを並列で読み込むメイン関数
// キャッシュからファイルを読み、失敗時は空のFeatureCollectionを返す
export async function loadGeoJson(targets: Props[]) {
  const tasks = targets.map(async ({ type, feature }) => {
    const path = `${dirs[type]}/${feature}.geojson`;
    try {
      const text = await FileSystem.readAsStringAsync(path);
      return await parseGeoJsonAsync(text);
    } catch (e) {
      console.warn(e);
      return { type: "FeatureCollection", features: [] } as FeatureCollection;
    }
  });

  const parsedDatas = await Promise.all(tasks);
  return parsedDatas;
}
