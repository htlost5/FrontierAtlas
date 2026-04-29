// assetDataSet の公開エクスポートをまとめる。
import assetManifest from "@/assets/data/manifest.json";
import { atomicWrite, expoRead } from "@/src/infra/FileSystem/fileSystem";
import { parseJson, stringifyJson } from "@/src/infra/jsonParse/jsonParser";
import { LOCAL_MANFEST_PATH } from "../../paths";
import { BuildManifest, LocalManifest } from "../manifestType";
import setUpdatePlan from "../tasks/setUpdatePlan";
import { UpdateType } from "../tasks/setUpdatePlan/types";
import cleanupTmp from "../useCase/file/cleanupTmp";
import { assetApplyUpdatePlan } from "./tasks/dataUpdate";
import { updateRegistry } from "../tasks/updateRegistry";

export async function loadAssetGeoJson() {
  let localManifest: LocalManifest | null = null;
  let buildManifest: BuildManifest;

  try {
    const text = await expoRead(LOCAL_MANFEST_PATH);
    localManifest = parseJson(text);
  } catch {
    localManifest = null;
  }

  // tmpファイルのクリーンアップ
  cleanupTmp();

  // buildManifest定義
  buildManifest = assetManifest;

  // localManifestの初期設定
  if (!localManifest) {
    localManifest = {
      version: null,
      files: {},
    };
  }

  // 差分検出
  const updatePlan: UpdateType = setUpdatePlan(buildManifest, localManifest);

  // updatePlan
  localManifest = assetApplyUpdatePlan(
    updatePlan,
    buildManifest,
    localManifest,
  );

  localManifest.version = buildManifest.version;

  const localManifestTxt = stringifyJson(localManifest);
  atomicWrite(LOCAL_MANFEST_PATH, localManifestTxt);

  await updateRegistry(buildManifest);

  console.log("asset all succeed")
}
