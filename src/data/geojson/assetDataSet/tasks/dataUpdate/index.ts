// dataUpdate の公開エクスポートをまとめる。
import { BuildManifest, LocalManifest } from "../../../manifestType";
import { UpdateType } from "../../../tasks/setUpdatePlan/types";
import { sortFilesById } from "../../../useCase/utils/sortFilesById";
import { assetDataAdd } from "./update/add";
import { assetDataDelete } from "./update/delete";
import { assetDataUpdate } from "./update/update";

export function assetApplyUpdatePlan(
  updatePlan: UpdateType,
  buildManifest: BuildManifest,
  localManifest: LocalManifest,
): LocalManifest {
  let nextManifest: LocalManifest = localManifest;

  nextManifest = assetDataAdd(updatePlan.add, buildManifest, localManifest);

  nextManifest = assetDataUpdate(
    updatePlan.update,
    buildManifest,
    localManifest,
  );

  nextManifest = assetDataDelete(updatePlan.delete, localManifest);

  // sort
  nextManifest.files = sortFilesById(localManifest.files, buildManifest.files);
  
  return nextManifest;
}
