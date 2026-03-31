import { RELEASES_URL } from "@/src/data/urls";
import { BuildManifest, LocalManifest } from "../../manifestType";
import { sortFilesById } from "../../useCase/utils/sortFilesById";
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
  let nextManifest: LocalManifest = localManifest;

  const DATA_SOURCE_URL = `${RELEASES_URL}/${version}`;
  // updatePlan -> add 実行
  nextManifest = await dataAdd(
    updatePlan.add,
    DATA_SOURCE_URL,
    buildManifest,
    nextManifest,
  );

  // updatePlan -> update 実行
  nextManifest = await dataUpdate(
    updatePlan.update,
    DATA_SOURCE_URL,
    buildManifest,
    nextManifest,
  );

  // updatePlan -> delete 実行
  nextManifest = dataDelete(updatePlan.delete, buildManifest, nextManifest);

  // localManifest totalsize/sha256 更新
  // sort -> tmp保存 -> 完全保存
  nextManifest.files = sortFilesById(localManifest.files, buildManifest.files);

  return nextManifest;
}

// localManifest　それぞれの処理でfilesに追加 -> 最後totalSize / sha256の計測
