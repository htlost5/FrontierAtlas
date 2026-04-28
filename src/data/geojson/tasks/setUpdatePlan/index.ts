// build manifest と local manifest の差分から、追加・更新・削除の更新計画を作成する処理です。
import { MapId } from "../../geojsonAssetMap";
import { BuildManifest, LocalManifest } from "../../manifestType";
import { addDetect } from "./detect/addDetect";
import { deleteDetect } from "./detect/deleteDetect";
import { updateDetect } from "./detect/updateDetect";
import { UpdateType } from "./types";

/**
 * リモート（build）とローカルの manifest 差分を比較して更新計画を返します。
 * @param buildManifest リモート配信側の manifest。
 * @param localManifest 端末側の manifest（未保持時は null）。
 * @returns `update` / `add` / `delete` の ID 一覧。
 */
export default function setUpdatePlan(
  buildManifest: BuildManifest,
  localManifest: LocalManifest | null,
): UpdateType {
  const buildFiles = buildManifest.files;
  const buildIds = Object.keys(buildFiles) as MapId[];

  if (!localManifest) {
    return {
      update: [],
      add: buildIds,
      delete: [],
    };
  }

  const localFiles = localManifest.files;
  const localIds = Object.keys(localFiles) as MapId[];

  const updateList = updateDetect(buildFiles, localFiles);
  const addList = addDetect(buildIds, localIds);
  const deleteList = deleteDetect(buildIds, localIds);

  return {
    update: updateList,
    add: addList,
    delete: deleteList,
  };
}
