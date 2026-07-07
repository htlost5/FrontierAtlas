// GeoJSON データ管理システムの型定義
// MapId は geojsonAssetMap.ts から import して使用

import type { MapId } from "@/src/data/geojson/geojsonAssetMap";

export type { MapId };

/** SQLite geojson_data テーブルの行に対応する型 */
export interface GeoJsonRow {
  map_id: string;
  data: string;
  sha256: string;
  size: number;
  version: string;
  source: "remote" | "asset";
  created_at: number;
  updated_at: number;
}

/** 更新計画: どのファイルを追加/更新/削除するか */
export interface UpdatePlan {
  add: MapId[];
  update: MapId[];
  delete: MapId[];
}

/** 更新実行結果（ファイル単位） */
export interface UpdateResult {
  mapId: MapId;
  status: "success" | "failed" | "skipped";
  error?: string;
}

/** リモート version.json の型 */
export interface VersionInfo {
  version: string;
  manifestSha256: string;
  manifestSize: number;
}
