// geojson データ管理の新しい公開エントリポイント
// SQLite 永続化・ハイブリッド更新戦略・部分成功・クォータ制限対応

import { GeojsonRepository } from "./repository/GeojsonRepository";
import { UpdateService } from "./service/UpdateService";
import { AssetRestoreService } from "./service/AssetRestoreService";
import type { UpdateResult } from "./types";
import { QuotaExceededError } from "@/src/domain/NetworkErrors";
import type { LocalManifest } from "@/src/domain/manifestTypes";

export type { UpdateResult } from "./types";

/** クォータ超過状態を外部に通知するためのコールバック型 */
export type QuotaCallback = (exceeded: boolean, message: string) => void;

/** 登録されたクォータ超過コールバック */
let onQuotaExceeded: QuotaCallback | null = null;

/** クォータ超過時のコールバックを登録 */
export function setOnQuotaExceeded(cb: QuotaCallback) {
  onQuotaExceeded = cb;
}

/**
 * GeoJSON データシステムを初期化する。
 */
export async function initializeGeoData(): Promise<void> {
  const repo = GeojsonRepository.getInstance();
  await repo.initialize();

  const deletedOrphans = await repo.cleanupOrphans();
  if (deletedOrphans > 0) {
    console.log(`[GeoJsonInit] Cleaned up ${deletedOrphans} orphaned entries`);
  }

  const localManifest = await repo.getLocalManifest();

  if (!localManifest || Object.keys(localManifest.files).length === 0) {
    console.log("[GeoJsonInit] First launch: restoring from assets");
    const assetService = new AssetRestoreService(repo);
    await assetService.restoreFromAssets();
    const manifest = await assetService.buildLocalManifest();
    await repo.setLocalManifest(manifest);
    return;
  }

  console.log(`[GeoJsonInit] Cache exists (version: ${localManifest.version}), ready to use`);
}

/**
 * リモートの更新を確認し、差分があればバックグラウンドで更新を実行する。
 * クォータ超過時は自動的にキャッシュフォールバックし、コールバックで通知する。
 */
export async function checkAndUpdate(): Promise<UpdateResult[]> {
  const repo = GeojsonRepository.getInstance();
  const updateService = new UpdateService(repo);

  try {
    const versionInfo = await updateService.fetchLatestVersionInfo();
    if (!versionInfo) {
      console.log("[GeoJsonInit] Offline or version fetch failed, skipping update");
      return [];
    }

    const localManifest = await repo.getLocalManifest();
    if (localManifest?.version === versionInfo.version) {
      console.log("[GeoJsonInit] Already up to date");
      return [];
    }

    const buildManifest = await updateService.fetchBuildManifest(versionInfo);
    if (!buildManifest) {
      console.warn("[GeoJsonInit] Failed to fetch build manifest, skipping update");
      return [];
    }

    const plan = updateService.generateUpdatePlan(buildManifest, localManifest);
    if (plan.add.length === 0 && plan.update.length === 0 && plan.delete.length === 0) {
      console.log("[GeoJsonInit] No updates needed");
      return [];
    }

    console.log(`[GeoJsonInit] Update plan: ${plan.add.length} add, ${plan.update.length} update, ${plan.delete.length} delete`);

    const results = await updateService.executeUpdate(plan, versionInfo.version, buildManifest);

    // localManifest 更新
    const updatedManifest: LocalManifest = { version: buildManifest.version, files: {} };
    for (const mapId of Object.keys(buildManifest.files)) {
      const result = results.find((r) => r.mapId === mapId);
      if (result?.status === "success" || result?.status === "skipped") {
        updatedManifest.files[mapId] = buildManifest.files[mapId];
      } else if (localManifest?.files[mapId]) {
        updatedManifest.files[mapId] = localManifest.files[mapId];
      }
    }
    for (const mapId of plan.delete) {
      delete updatedManifest.files[mapId];
    }
    await repo.setLocalManifest(updatedManifest);

    const failed = results.filter((r) => r.status === "failed");
    if (failed.length > 0) {
      console.warn(`[GeoJsonInit] Partial update: ${failed.length}/${results.length} failed`);
    } else {
      console.log("[GeoJsonInit] Update completed successfully");
      await repo.clearFailures();
    }

    return results;
  } catch (e) {
    // クォータ超過時: キャッシュで継続しつつ通知
    if (e instanceof QuotaExceededError) {
      console.warn(`[GeoJsonInit] Quota exceeded: ${e.message}`);
      console.warn("[GeoJsonInit] Falling back to existing cache. Remote update paused until next cycle.");
      if (onQuotaExceeded) {
        onQuotaExceeded(true, e.message);
      }
      return [];
    }

    // その他の想定外エラー
    console.error("[GeoJsonInit] Unexpected error during update:", e);
    return [];
  }
}

export { GeojsonRepository } from "./repository/GeojsonRepository";
export type { UpdatePlan, VersionInfo } from "./types";
