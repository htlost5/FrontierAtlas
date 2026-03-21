import { expoRead } from "@/src/infra/FileSystem/fileSystem";
import { parseJson } from "@/src/infra/jsonParse/jsonParser";
import { Manifest, ManifestFiles } from "./manifestType";
import cleanupTmp from "./tasks/cleanupTmp";
import getLatestVersion from "./tasks/getLatestVersion";
import setBuildManifest from "./tasks/setBuildManifest";

export default async function loadAllGeoJson() {
  let localManifest: ManifestFiles | null = null;

  try {
    const text = await expoRead("data/manifest.json");
    localManifest = parseJson(text);
  } catch (e) {
    localManifest = null;
  }

  // tmpファイルのクリーンアップ
  cleanupTmp(localManifest);
  // console.log("clean All Files");

  // latestバージョン取得
  const version = await getLatestVersion();
  // console.log(`version: ${version}`);

  // localManifest, 参照用 manifest を定義
  if (!localManifest) localManifest = {};

  const buildManifest: Manifest = await setBuildManifest(version);

  
}
