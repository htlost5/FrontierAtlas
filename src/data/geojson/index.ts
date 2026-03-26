import { expoRead } from "@/src/infra/FileSystem/fileSystem";
import { parseJson } from "@/src/infra/jsonParse/jsonParser";
import { Manifest } from "./manifestType";
import cleanupTmp from "./tasks/cleanupTmp";
import getLatestVersion from "./tasks/getLatestVersion";
import setBuildManifest from "./tasks/setBuildManifest";

import assetManifest from "@/assets/data/manifest.json";
import {
  Sha256MismatchError,
  SizeMismatchError,
  ValidationError,
  VersionMismatchError,
} from "@/src/domain/ManifestErrors";
import { NetworkError } from "@/src/domain/NetworkErrors";
import expoWalk from "@/src/infra/FileSystem/walk";
import setUpdatePlan from "./tasks/setUpdatePlan";
import { UpdateType } from "./tasks/setUpdatePlan/types";

export default async function loadAllGeoJson() {
  let localManifest: Manifest | null = null;
  let buildManifest: Manifest;

  try {
    const text = await expoRead("data/manifest.json");
    localManifest = parseJson(text);
  } catch (e) {
    localManifest = null;
  }

  // ディレクトリ内ファイル確認
  console.log(`files: ${expoWalk("data/imdf")}`);

  // tmpファイルのクリーンアップ
  cleanupTmp(localManifest);

  let networkAvailable = true;

  let version: string | null;

  // latestバージョン取得
  try {
    version = await getLatestVersion();
  } catch (e) {
    networkAvailable = false;
    version = null;
  }

  console.log(`version: ${version}`);


  // buildManifest定義
  if (!version) {
    buildManifest = assetManifest;
  } else {
    try {
      buildManifest = await setBuildManifest(version);
    } catch (e) {
      if (e instanceof NetworkError) {
        networkAvailable = false;
        buildManifest = assetManifest;
      } else if (
        e instanceof SizeMismatchError ||
        e instanceof Sha256MismatchError ||
        e instanceof ValidationError
      ) {
        buildManifest = assetManifest;
      } else if (e instanceof VersionMismatchError) {
        console.error("Server version mismatch. Abort.");
        throw e;
      } else {
        throw e;
      }
    }
  }

  // 差分検出
  // const updatePlan: UpdateType = setUpdatePlan(buildManifest, localManifest);
}
