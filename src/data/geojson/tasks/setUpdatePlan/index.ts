import { MapId } from "../../geojsonAssetMap";
import { Manifest } from "../../manifestType";
import { addDetect } from "./detect/addDetect";
import { deleteDetect } from "./detect/deleteDetect";
import { updateDetect } from "./detect/updateDetect";
import { UpdateType } from "./types";

export default function setUpdatePlan(
  buildManifest: Manifest,
  localManifest: Manifest | null,
): UpdateType {
  const buildFiles = buildManifest.files;
  const buildIds = Object.keys(buildFiles) as MapId[];

  if (!localManifest) {
    const updateList: UpdateType = {
      update: [],
      add: buildIds,
      delete: [],
    };
    return updateList;
  }

  const localFiles = localManifest.files;
  const localIds = Object.keys(localFiles) as MapId[];

  const updateList = updateDetect(buildFiles, localFiles);
  const addList = addDetect(buildIds, localIds);
  const deleteList = deleteDetect(buildIds, localIds);

  const updatePlan: UpdateType = {
    update: updateList,
    add: addList,
    delete: deleteList,
  };

  return updatePlan;
}
