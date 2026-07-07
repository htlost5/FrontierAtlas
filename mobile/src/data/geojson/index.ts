// geojson データ管理の新しい公開エントリポイント
// SQLite 永続化・ハイブリッド更新戦略・部分成功を実現

import { GeojsonRepository } from "./repository/GeojsonRepository";
import { UpdateService } from "./service/UpdateService";
import { AssetRestoreService } from "./service/AssetRestoreService";
import type { UpdateResult } from "./types";

export type { UpdateResult } from "./types";

/**
 * GeoJSON データシステムを初期化する。
 * - 初回起動時: アセットバンドルから SQLite にデータをリストア
 * - 既存キャッシュあり: 即座に利用可能。バックグラウンド更新は別途
 */
export async function initializeGeoData(): Promise<void> {
  const repo = GeojsonRepository.getInstance();
  await repo.initialize();

  // 起動時クリーンアップ: source='remote' で local_manifest にない orphans を削除
  const deletedOrphans = await repo.cleanupOrphans();
  if (deletedOrphans > 0) {
    console.log(
      `[GeoJsonInit] Cleaned up ${deletedOrphans} orphaned entries`,
    );
  }

  const localManifest = await repo.getLocalManifest();

  if (!localManifest || Object.keys(localManifest.files).length === 0) {
    // 初回: アセットからリストア
    console.log("[GeoJsonInit] First launch: restoring from assets");
    const assetService = new AssetRestoreService(repo);
    await assetService.restoreFromAssets();

    // localManifest 保存
    const manifest = await assetService.buildLocalManifest();
    await repo.setLocalManifest(manifest);
    return;
  }

  // 既存キャッシュあり: 即表示可能。バックグラウンド更新は別途
  console.log(
    `[GeoJsonInit] Cache exists (version: ${localManifest.version}), ready to use`,
  );
}

/**
 * リモートの更新を確認し、差分があればバックグラウンドで更新を実行する。
 * 部分成功対応: 各ファイル独立して成功/失敗を返す。
 * @returns 更新結果の配列
 */
export async function checkAndUpdate(): Promise<UpdateResult[]> {
  const repo = GeojsonRepository.getInstance();
  const updateService = new UpdateService(repo);

  // 最新バージョン情報取得
  const versionInfo = await updateService.fetchLatestVersionInfo();
  if (!versionInfo) {
    console.log("[GeoJsonInit] Offline or version fetch failed, skipping update");
    return [];
  }

  // ローカルマニフェスト取得
  const localManifest = await repo.getLocalManifest();

  // 同じバージョンならスキップ
  if (localManifest?.version === versionInfo.version) {
    console.log("[GeoJsonInit] Already up to date");
    return [];
  }

  // ビルドマニフェスト取得
  const buildManifest = await updateService.fetchBuildManifest(versionInfo);
  if (!buildManifest) {
    console.warn("[GeoJsonInit] Failed to fetch build manifest, skipping update");
    return [];
  }

  // 更新計画生成
  const plan = updateService.generateUpdatePlan(buildManifest, localManifest);

  if (
    plan.add.length === 0 &&
    plan.update.length === 0 &&
    plan.delete.length === 0
  ) {
    console.log("[GeoJsonInit] No updates needed");
    return [];
  }

  console.log(
    `[GeoJsonInit] Update plan: ${plan.add.length} add, ${plan.update.length} update, ${plan.delete.length} delete`,
  );

  // 更新実行（部分成功対応）
  const results = await updateService.executeUpdate(
    plan,
    versionInfo.version,
    buildManifest,
  );

  // localManifest 更新
  const updatedManifest: LocalManifest = {
    version: buildManifest.version,
    files: {},
  };

  // buildManifest の全ファイルをベースに、失敗したものは旧情報を維持
  const repo2 = repo;
  for (const mapId of Object.keys(buildManifest.files)) {
    const result = results.find((r) => r.mapId === mapId);
    if (result?.status === "success" || result?.status === "skipped") {
      updatedManifest.files[mapId] = buildManifest.files[mapId];
    } else if (localManifest?.files[mapId]) {
      // 失敗時は旧情報を維持（次の更新で再試行）
      updatedManifest.files[mapId] = localManifest.files[mapId];
    }
  }

  // delete 用: 削除成功したものは files から除外
  for (const mapId of plan.delete) {
    delete updatedManifest.files[mapId];
  }

  await repo2.setLocalManifest(updatedManifest);

  const failed = results.filter((r) => r.status === "failed");
  if (failed.length > 0) {
    console.warn(
      `[GeoJsonInit] Partial update: ${failed.length}/${results.length} failed`,
    );
  } else {
    console.log("[GeoJsonInit] Update completed successfully");
    // 全ファイル成功時に失敗履歴をクリア
    await repo2.clearFailures();
  }

  return results;
}

/** 旧互換性のためのエクスポート */
export { GeojsonRepository } from "./repository/GeojsonRepository";
export type { UpdatePlan, VersionInfo } from "./types";

// 以下、型インポート用（LocalManifest は内部利用のため型のみ）
import type { LocalManifest } from "@/src/domain/manifestTypes";
