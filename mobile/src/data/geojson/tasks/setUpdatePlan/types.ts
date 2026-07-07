// types の型定義をまとめる。
import type { MapId } from "../../geojsonAssetMap";

export type UpdateType = {
  add: MapId[];
  update: MapId[];
  delete: MapId[];
};
