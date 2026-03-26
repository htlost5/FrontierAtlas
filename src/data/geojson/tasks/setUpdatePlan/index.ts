import { Manifest } from "../../manifestType";
import { addDetect } from "./addDetect";
import { deleteDetect } from "./deleteDetect";
import { UpdateType } from "./types";
import { updateDetect } from "./updateDetect";

export default function setUpdatePlan(
  buildManifest: Manifest,
  localManifest: Manifest,
): UpdateType {
  const buildFiles = buildManifest.files;
  const localFiles = localManifest.files;

  const buildIds = Object.keys(buildFiles);
  const localIds = Object.keys(localFiles);

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
