// アセットバンドルから SQLite へのリストアサービス
// 初回起動時またはキャッシュが空の場合にアセット内蔵データを SQLite に展開

import type { FeatureCollection } from "geojson";
import { GeojsonRepository } from "@/src/data/geojson/repository/GeojsonRepository";
import {
  geoJsonMap,
  type MapId,
} from "@/src/data/geojson/geojsonAssetMap";
import { sha256 } from "@/src/infra/sha256/hashCheck";
import { stringifyJson } from "@/src/infra/jsonParse/jsonParser";
import assetManifest from "@/assets/maps/manifest.json";
import type { BuildManifest, LocalManifest } from "@/src/domain/manifestTypes";

// アセットマニフェストの型（count フィールドを含む）
type AssetManifest = BuildManifest & { count?: number };
const typedAssetManifest = assetManifest as AssetManifest;

// ランタイム検証
if (!typedAssetManifest.version || !typedAssetManifest.files) {
  throw new Error("Asset manifest is invalid: missing version or files");
}

const ASSET_VERSION = typedAssetManifest.version;

export class AssetRestoreService {
  private repo: GeojsonRepository;

  constructor(repo: GeojsonRepository) {
    this.repo = repo;
  }

  /**
   * アセットバンドルから全 GeoJSON データを SQLite にリストア
   * 既存データがある場合は上書きしない（source='asset' のもののみ）
   */
  async restoreFromAssets(): Promise<number> {
    const restoredCount = await this.restoreAllAssets();
    console.log(
      `[AssetRestoreService] Restored ${restoredCount} GeoJSON files from assets`,
    );
    return restoredCount;
  }

  /**
   * 全アセットデータを SQLite に upsert（source='asset'）
   */
  private async restoreAllAssets(): Promise<number> {
    const ids = Object.keys(geoJsonMap) as MapId[];
    let count = 0;

    for (const mapId of ids) {
      const assetItem = geoJsonMap[mapId];
      if (!assetItem) continue;

      try {
        const data = assetItem.content as FeatureCollection;
        const json = stringifyJson(data);
        const hash = sha256(json);
        const size = new TextEncoder().encode(json).length;

        // 既存の asset データがある場合はスキップ（同一性確認）
        const existingSource = await this.repo.getSource(mapId);
        if (existingSource === "asset") {
          // すでにアセットからリストア済み
          const existingData = await this.repo.get(mapId);
          if (existingData) {
            // 差分がなければスキップして高速化
            const existingJson = stringifyJson(existingData);
            if (sha256(existingJson) === hash) {
              count++;
              continue;
            }
          }
        }

        await this.repo.upsert(mapId, data, {
          sha256: hash,
          size,
          version: ASSET_VERSION,
          source: "asset",
        });

        count++;
      } catch (e) {
        console.warn(
          `[AssetRestoreService] Failed to restore ${mapId}:`,
          e,
        );
        // 部分成功: 1ファイル失敗しても続行
      }
    }

    return count;
  }

  /**
   * アセットバンドルの manifest から localManifest を構築
   */
  async buildLocalManifest(): Promise<LocalManifest> {
    const files: LocalManifest["files"] = {};
    const ids = Object.keys(geoJsonMap) as MapId[];

    for (const mapId of ids) {
      const buildItem = typedAssetManifest.files[mapId];
      if (buildItem) {
        files[mapId] = {
          relativePath: buildItem.relativePath,
          size: buildItem.size,
          sha256: buildItem.sha256,
        };
      }
    }

    return {
      version: ASSET_VERSION,
      files,
    };
  }
}
