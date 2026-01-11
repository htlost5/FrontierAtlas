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
  floor1: { section: section_floor1, unit: unit_floor1 },
  floor2: { section: section_floor2, unit: unit_floor2 },
  floor3: { section: section_floor3, unit: unit_floor3 },
  floor4: { section: section_floor4, unit: unit_floor4 },
  floor5: { section: section_floor5, unit: unit_floor5 },
  others: { stair: stairs },
};

/**
 * アセットからGeoJSONデータを読み込む
 * @param data - 読み込むアセット
 * @returns GeoJSONテキスト
 */
async function loadData(data: any) {
  const asset = Asset.fromModule(data);
  await asset.downloadAsync();
  const geoJsonText = await FileSystem.readAsStringAsync(asset.localUri!);
  return geoJsonText;
}

/**
 * すべてのGeoJSONファイルをキャッシュディレクトリに読み込む
 * 既存のキャッシュを削除してから新しいデータを書き込む
 */
export default async function loadAll() {
  const cacheDir = `${FileSystem.documentDirectory}geoJson_cache`;
  try {
    await FileSystem.deleteAsync(cacheDir, { idempotent: true });
  } catch (e) {
    console.warn("rm error:", e);
  }

  try {
    await FileSystem.makeDirectoryAsync(`${cacheDir}/venues`, {
      intermediates: true,
    });
    await FileSystem.makeDirectoryAsync(`${cacheDir}/sections`, {
      intermediates: true,
    });
    await FileSystem.makeDirectoryAsync(`${cacheDir}/units`, {
      intermediates: true,
    });
    await FileSystem.makeDirectoryAsync(`${cacheDir}/others`, {
      intermediates: true,
    });
  } catch (e) {
    console.warn("make error:", e);
  }

  for (const info of Object.keys(dataFiles) as (keyof typeof dataFiles)[]) {
    if (info === "venues") {
      const { venue, studyhall, interact } = dataFiles[info] as {
        venue: any;
        studyhall: any;
        interact: any;
      };
      if (venue) {
        const convertVenue = await loadData(venue);
        await FileSystem.writeAsStringAsync(
          `${cacheDir}/venues/venue.geojson`,
          convertVenue
        );
      }
      if (studyhall) {
        const convertStudyhall = await loadData(studyhall);
        await FileSystem.writeAsStringAsync(
          `${cacheDir}/venues/studyhall.geojson`,
          convertStudyhall
        );
      }
      if (interact) {
        const convertInteract = await loadData(interact);
        await FileSystem.writeAsStringAsync(
          `${cacheDir}/venues/interact.geojson`,
          convertInteract
        );
      }
    } else if (info.match(/^floor\d+$/)) {
      const { section, unit } = dataFiles[info] as { section: any; unit: any };
      if (section) {
        const convertSection = await loadData(section);
        await FileSystem.writeAsStringAsync(
          `${cacheDir}/sections/${info}.geojson`,
          convertSection
        );
      }
      if (unit) {
        const convertUnit = await loadData(unit);
        await FileSystem.writeAsStringAsync(
          `${cacheDir}/units/${info}.geojson`,
          convertUnit
        );
      }
    } else if (info === "others") {
      for (const item of Object.keys(
        dataFiles.others
      ) as (keyof typeof dataFiles.others)[]) {
        const convertItem = await loadData(dataFiles.others[item]);
        await FileSystem.writeAsStringAsync(
          `${cacheDir}/others/${item}.geojson`,
          convertItem
        );
      }
    }
  }
}

// dataSet => convert(string) => input convertData to cacheFiles
