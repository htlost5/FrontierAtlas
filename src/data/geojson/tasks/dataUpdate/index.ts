import { RELEASES_URL } from "@/src/data/urls";
import { Manifest } from "../../manifestType";
import { UpdateType } from "../setUpdatePlan/types";
import { dataAdd } from "./update/add";
import { dataDelete } from "./update/delete";
import { dataUpdate } from "./update/update";

export function runUpdatePlan(
  updatePlan: UpdateType,
  version: string | null,
  buildManifest: Manifest,
) {
  const DATA_SOURCE_URL = `${RELEASES_URL}/${version}`;
  // updatePlan -> add 実行
  dataAdd(updatePlan.add, DATA_SOURCE_URL, buildManifest);

  // updatePlan -> update 実行
  dataUpdate(updatePlan.update, DATA_SOURCE_URL, buildManifest);

  // updatePlan -> delete 実行
  dataDelete(updatePlan.delete, buildManifest);
}
