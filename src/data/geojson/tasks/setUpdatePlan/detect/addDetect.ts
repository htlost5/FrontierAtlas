import { MapId } from "../../../geojsonAssetMap";

export function addDetect(buildIds: MapId[], localIds: MapId[]): MapId[] {
  const addList: MapId[] = buildIds.filter((id) => !localIds.includes(id));

  return addList;
}
