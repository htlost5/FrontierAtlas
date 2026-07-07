// addDetect のGeoJSONデータ処理を定義する。
import { MapId } from "../../../geojsonAssetMap";

export function addDetect(buildIds: MapId[], localIds: MapId[]): MapId[] {
  const addList: MapId[] = buildIds.filter((id) => !localIds.includes(id));

  return addList;
}
