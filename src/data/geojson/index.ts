import { expoRead } from "@/src/infra/FileSystem/fileSystem";
import { parseJson } from "@/src/infra/jsonParse/jsonParser";
import { BuildManifest, LocalManifest } from "./manifestType";
import cleanupTmp from "./useCase/cleanupTmp";
import getLatestVersion from "./useCase/getLatestVersion";
import setBuildManifest from "./useCase/setBuildManifest";

import assetManifest from "@/assets/data/manifest.json";
import {
  Sha256MismatchError,
  SizeMismatchError,
  ValidationError,
  VersionMismatchError,
} from "@/src/domain/ManifestErrors";
import { NetworkError } from "@/src/domain/NetworkErrors";
import { sha256 } from "@/src/infra/sha256/hashCheck";
import { applyUpdatePlan } from "./tasks/dataUpdate";
import setUpdatePlan from "./tasks/setUpdatePlan";
import { UpdateType } from "./tasks/setUpdatePlan/types";
import { updateRegistry } from "./tasks/updateRegistry";

export default async function loadAllGeoJson() {
  let localManifest: LocalManifest | null = null;
  let buildManifest: BuildManifest;

  try {
    const text = await expoRead("data/manifest.json");
    localManifest = parseJson(text);
  } catch (e) {
    localManifest = null;
  }

  // ディレクトリ内ファイル確認
  // console.log(`files: ${expoWalk("data/imdf")}`);

  // tmpファイルのクリーンアップ
  cleanupTmp();

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

  // localManifestの初期設定
  if (!localManifest) {
    localManifest = {
      version: buildManifest.version,
      files: {},
      totalSize: 0,
      totalSha256: sha256(""),
    };
  }

  // 差分検出
  const updatePlan: UpdateType = setUpdatePlan(buildManifest, localManifest);

  // updatePlan（アセットorリモート取得 -> ローカルへ） / localManifest更新
  localManifest = await applyUpdatePlan(
    updatePlan,
    version,
    buildManifest,
    localManifest,
  );

  // アプリレジストリへの登録
  await updateRegistry(buildManifest);
  console.log("all succeed");
}

// 保存時に書き込むlocal-manifestは？？
