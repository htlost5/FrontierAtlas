import { atomicWrite, expoRead } from "@/src/infra/FileSystem/fileSystem";
import { parseJson, stringifyJson } from "@/src/infra/jsonParse/jsonParser";
import { BuildManifest, LocalManifest } from "./manifestType";
import cleanupTmp from "./useCase/file/cleanupTmp";
import setBuildManifest from "./useCase/manifest/setBuildManifest";

import assetManifest from "@/assets/data/manifest.json";
import {
  Sha256MismatchError,
  SizeMismatchError,
  ValidationError,
  VersionMismatchError,
} from "@/src/domain/ManifestErrors";
import { NetworkError } from "@/src/domain/NetworkErrors";
import { LOCAL_MANFEST_PATH } from "../paths";
import { applyUpdatePlan } from "./tasks/dataUpdate";
import setUpdatePlan from "./tasks/setUpdatePlan";
import { UpdateType } from "./tasks/setUpdatePlan/types";
import { updateRegistry } from "./tasks/updateRegistry";
import getLatestVersion from "./useCase/version/getLatestVersion";

export default async function loadAllGeoJson() {
  let localManifest: LocalManifest | null = null;
  let buildManifest: BuildManifest;

  let manifestSource: "remote" | "asset";

  try {
    const text = await expoRead(LOCAL_MANFEST_PATH);
    localManifest = parseJson(text);
  } catch (e) {
    localManifest = null;
  }

  // ディレクトリ内ファイル確認
  // console.log(`files: ${expoWalk("data/imdf")}`);

  // tmpファイルのクリーンアップ
  cleanupTmp();

  let version: string | null;

  // latestバージョン取得
  try {
    version = await getLatestVersion();
  } catch (e) {
    version = null;
  }
  console.log(`version: ${version}`);

  // buildManifest定義
  if (!version) {
    buildManifest = assetManifest;
    manifestSource = "asset";
  } else {
    try {
      buildManifest = await setBuildManifest(version);
      manifestSource = "remote";
    } catch (e) {
      if (e instanceof NetworkError) {
        buildManifest = assetManifest;
        manifestSource = "asset";
      } else if (
        e instanceof SizeMismatchError ||
        e instanceof Sha256MismatchError ||
        e instanceof ValidationError
      ) {
        buildManifest = assetManifest;
        manifestSource = "asset";
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
      version: null,
      files: {},
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

  // version更新
  localManifest.version = buildManifest.version;

  const localManifestData = stringifyJson(localManifest);
  atomicWrite(LOCAL_MANFEST_PATH, localManifestData);

  // アプリレジストリへの登録
  await updateRegistry(buildManifest);

  console.log("all succeed");
}
