import { atomicWrite, expoRead } from "@/src/infra/FileSystem/fileSystem";
import { parseJson, stringifyJson } from "@/src/infra/jsonParse/jsonParser";
import { BuildManifest, LocalManifest } from "../manifestType";
import cleanupTmp from "../useCase/file/cleanupTmp";
import setBuildManifest from "./useCase/manifest/setBuildManifest";

import { LOCAL_MANFEST_PATH } from "../../paths";
import setUpdatePlan from "../tasks/setUpdatePlan";
import { UpdateType } from "../tasks/setUpdatePlan/types";
import { updateRegistry } from "../tasks/updateRegistry";
import { remoteApplyUpdatePlan } from "./tasks/dataUpdate";
import getLatestVersion from "./useCase/version/getLatestVersion";

export default async function loadRemoteGeoJson() {
  let lastError: Error;

  let localManifest: LocalManifest | null = null;
  let buildManifest: BuildManifest;

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

  let version: string;

  // latestバージョン取得
  try {
    version = await getLatestVersion();
  } catch (e) {
    throw new Error("version fetch failed");
  }
  console.log(`version: ${version}`);

  // buildManifest定義
  try {
    buildManifest = await setBuildManifest(version);
  } catch (e) {
    throw e;
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
  localManifest = await remoteApplyUpdatePlan(
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

/* 
  現状の問題
  -> リモート時成功
  -> 取得失敗時、全フォルダに対して同じ用にネット経由で取得
  -> 一度失敗したら、すべてのデータをアセットからにする
  ※manifestSourceの利用
*/
