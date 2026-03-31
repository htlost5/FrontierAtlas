import { RELEASES_URL } from "@/src/data/urls";
import { BuildManifest, LocalManifest } from "../../manifestType";
import { UpdateType } from "../setUpdatePlan/types";
import { dataAdd } from "./update/add";
import { dataDelete } from "./update/delete";
import { dataUpdate } from "./update/update";

export async function applyUpdatePlan(
  updatePlan: UpdateType,
  version: string | null,
  buildManifest: BuildManifest,
  localManifest: LocalManifest,
): Promise<LocalManifest> {
  const DATA_SOURCE_URL = `${RELEASES_URL}/${version}`;
  // updatePlan -> add 実行
  localManifest = await dataAdd(
    updatePlan.add,
    DATA_SOURCE_URL,
    buildManifest,
    localManifest,
  );

  // updatePlan -> update 実行
  dataUpdate(updatePlan.update, DATA_SOURCE_URL, buildManifest);

  // updatePlan -> delete 実行
  dataDelete(updatePlan.delete, buildManifest);

  return localManifest;
}

// localManifest　それぞれの処理でfilesに追加 -> 最後totalSize / sha256の計測
