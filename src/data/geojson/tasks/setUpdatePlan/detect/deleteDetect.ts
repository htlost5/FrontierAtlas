import { MapId } from "../../../geojsonAssetMap";

export function deleteDetect(buildIds: MapId[], localIds: MapId[]): MapId[] {
  const deleteList: MapId[] = localIds.filter((id) => !buildIds.includes(id));

  return deleteList;
}
