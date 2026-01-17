/**
 * GeoJSONファイルをキャッシュディレクトリに読み込むためのユーティリティ
 * アプリ起動時にIMDFデータをファイルシステムにキャッシュする
 */
import * as FileSystem from "expo-file-system";

import venue from "@/assets/imdf/venue.geojson";

import interact from "@/assets/imdf/interact/footprints/interact.geojson";
import studyhall from "@/assets/imdf/studyhall/footprints/studyhall.geojson";

import section_floor1 from "@/assets/imdf/studyhall/sections/floor1.geojson";
import section_floor2 from "@/assets/imdf/studyhall/sections/floor2.geojson";
import section_floor3 from "@/assets/imdf/studyhall/sections/floor3.geojson";
import section_floor4 from "@/assets/imdf/studyhall/sections/floor4.geojson";
import section_floor5 from "@/assets/imdf/studyhall/sections/floor5.geojson";

import unit_floor1 from "@/assets/imdf/studyhall/units/floor1.geojson";
import unit_floor2 from "@/assets/imdf/studyhall/units/floor2.geojson";
import unit_floor3 from "@/assets/imdf/studyhall/units/floor3.geojson";
import unit_floor4 from "@/assets/imdf/studyhall/units/floor4.geojson";
import unit_floor5 from "@/assets/imdf/studyhall/units/floor5.geojson";

import stairs from "@/assets/imdf/studyhall/units/study_stairs.geojson";
import { Asset } from "expo-asset";

// キャッシュするGeoJSONファイルの定義
const dataFiles = {
  venues: { venue: venue, studyhall: studyhall, interact: interact },
  floors: {
    floor1: { section: section_floor1, unit: unit_floor1 },
    floor2: { section: section_floor2, unit: unit_floor2 },
    floor3: { section: section_floor3, unit: unit_floor3 },
    floor4: { section: section_floor4, unit: unit_floor4 },
    floor5: { section: section_floor5, unit: unit_floor5 },
  },
  others: { stair: stairs },
};

type FloorKey = keyof typeof dataFiles.floors;

async function atomicWrite(filePath: string, content: string) {
  const tempPath = `${filePath}.tmp`;

  // 事前に tmp を確実に消す
  await FileSystem.deleteAsync(tempPath, { idempotent: true });

  // tmpに書き込み
  await FileSystem.writeAsStringAsync(tempPath, content);

  const tmpInfo = await FileSystem.getInfoAsync(tempPath);
  if (!tmpInfo.exists || tmpInfo.size === 0) {
    throw new Error(`atomicWrite: tmp write failed ${tempPath}`)
  }

  // 既存ファイル削除
  await FileSystem.deleteAsync(filePath, { idempotent: true });

  try {
    await FileSystem.copyAsync({ from: tempPath, to: filePath });

    // optonal: verify
    const finalInfo = await FileSystem.getInfoAsync(filePath);
    if (!finalInfo.exists || (finalInfo.size !== undefined && finalInfo.size === 0)) {
      throw new Error(`copy verification failed for ${filePath}`);
    }
  } finally {
    await FileSystem.deleteAsync(tempPath, { idempotent: true });
  }
}

/**
 * アセットからGeoJSONデータを読み込む
 * @param data - 読み込むアセット
 * @returns GeoJSONテキスト
 */
async function loadDataSafe(data: any) {
  const asset = Asset.fromModule(data);
  await asset.downloadAsync();

  const uri = asset.localUri ?? asset.uri;
  if (!uri) throw new Error("Asset has no URI");
  const geoJsonText = await FileSystem.readAsStringAsync(uri);
  return geoJsonText;
}

/**
 * すべてのGeoJSONファイルをキャッシュディレクトリに読み込む
 * 既存のキャッシュを削除してから新しいデータを書き込む
 */
export async function loadAllImproved() {
  const cacheDir = `${FileSystem.documentDirectory}geoJson_cache`;
  try {
    await FileSystem.deleteAsync(cacheDir, { idempotent: true });
  } catch (e) {
    console.warn("rm error:", e);
  }

  try {
    // create dirs
    await Promise.all([
      FileSystem.makeDirectoryAsync(`${cacheDir}/venues`, {
        intermediates: true,
      }),
      FileSystem.makeDirectoryAsync(`${cacheDir}/sections`, {
        intermediates: true,
      }),
      FileSystem.makeDirectoryAsync(`${cacheDir}/units`, {
        intermediates: true,
      }),
      FileSystem.makeDirectoryAsync(`${cacheDir}/others`, {
        intermediates: true,
      }),
    ]);
  } catch (e) {
    console.warn("make error:", e);
  }

  async function writeFile(path: string, assetModule: any) {
    const text = await loadDataSafe(assetModule);
    await atomicWrite(path, text);
  }

  async function writeFileSafe(path: string, assetModule: any) {
    try {
      await writeFile(path, assetModule);
    } catch (e) {
      console.warn("write failed:", path, e);
      throw e;
    }
  }

  if (dataFiles.venues) {
    const v = dataFiles.venues;
    if (v.venue)
      await writeFileSafe(`${cacheDir}/venues/venue.geojson`, v.venue);
    if (v.studyhall)
      await writeFileSafe(`${cacheDir}/venues/studyhall.geojson`, v.studyhall);
    if (v.interact)
      await writeFileSafe(`${cacheDir}/venues/interact.geojson`, v.interact);
  }

  for (const floor of Object.keys(dataFiles.floors) as FloorKey[]) {
    const entry = dataFiles.floors[floor];

    if (entry.section) {
      await writeFileSafe(
        `${cacheDir}/sections/${floor}.geojson`,
        entry.section
      );
    }

    if (entry.unit) {
      await writeFileSafe(`${cacheDir}/units/${floor}.geojson`, entry.unit);
    }
  }

  if (dataFiles.others) {
    for (const key of Object.keys(dataFiles.others)) {
      await writeFileSafe(
        `${cacheDir}/others/${key}.geojson`,
        (dataFiles.others as any)[key]
      );
    }
  }
}

// dataSet => convert(string) => input convertData to cacheFiles
