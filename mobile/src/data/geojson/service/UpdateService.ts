// リモート更新サービス
// バージョンチェック・マニフェスト取得・差分検出・実行を担当

import type { FeatureCollection } from "geojson";
import { GeojsonRepository } from "@/src/data/geojson/repository/GeojsonRepository";
import type {
  UpdatePlan,
  UpdateResult,
  VersionInfo,
  MapId,
} from "@/src/data/geojson/types";
import type { BuildManifest, LocalManifest } from "@/src/domain/manifestTypes";
import { NetworkError, QuotaExceededError } from "@/src/domain/NetworkErrors";
import { VersionFetchError } from "@/src/domain/VersionErrors";
import {
  Sha256MismatchError,
  SizeMismatchError,
  VersionMismatchError,
} from "@/src/domain/ManifestErrors";
import { LATEST_URL, RELEASES_URL } from "@/src/data/urls";
import {
  fetchJsonWithRetry,
  fetchTextWithRetry,
} from "@/src/infra/network/fetchJson";
import { sha256 } from "@/src/infra/sha256/hashCheck";
import { parseJson } from "@/src/infra/jsonParse/jsonParser";

export class UpdateService {
  private repo: GeojsonRepository;

  constructor(repo: GeojsonRepository) {
    this.repo = repo;
  }

  /**
   * 最新バージョン情報を取得
   * 現行の getLatestVersion を移植
   */
  async fetchLatestVersionInfo(): Promise<VersionInfo | null> {
    try {
      const latestUrl = LATEST_URL;
      const config = await fetchJsonWithRetry<{
        version: string;
        srcFolder: string;
      }>(latestUrl);

      if (!config || !config.version) {
        throw new VersionFetchError();
      }

      // version.json から詳細情報を取得
      const versionInfoUrl = `${RELEASES_URL}/${config.version}/data/version.json`;
      const versionInfo = await fetchJsonWithRetry<VersionInfo>(versionInfoUrl);

      if (!versionInfo) {
        throw new VersionFetchError();
      }

      return versionInfo;
    } catch (e) {
      if (e instanceof QuotaExceededError) throw e;
      if (e instanceof VersionFetchError || e instanceof NetworkError) {
        console.warn("[UpdateService] Failed to fetch version info:", e);
        return null;
      }
      console.warn("[UpdateService] Unexpected error fetching version:", e);
      return null;
    }
  }

  /**
   * ビルドマニフェストを取得・検証
   * 現行の setBuildManifest を移植
   */
  async fetchBuildManifest(
    versionInfo: VersionInfo,
  ): Promise<BuildManifest | null> {
    try {
      const manifestUrl = `${RELEASES_URL}/${versionInfo.version}/data/manifest.json`;

      // manifest テキストを直接取得し、サイズ/SHA256 検証
      const manifestText = await fetchTextWithRetry(manifestUrl, 3);
      if (!manifestText) {
        throw new NetworkError();
      }

      // size check
      const size = new TextEncoder().encode(manifestText).length;
      if (size !== versionInfo.manifestSize) {
        throw new SizeMismatchError();
      }

      // sha256 check
      const hash = sha256(manifestText);
      if (hash !== versionInfo.manifestSha256) {
        throw new Sha256MismatchError();
      }

      const remoteManifest = parseJson<BuildManifest>(manifestText);

      // version 一致確認
      if (versionInfo.version !== remoteManifest.version) {
        throw new VersionMismatchError();
      }

      return remoteManifest;
    } catch (e) {
      if (e instanceof QuotaExceededError) throw e;
      if (
        e instanceof NetworkError ||
        e instanceof SizeMismatchError ||
        e instanceof Sha256MismatchError ||
        e instanceof VersionMismatchError
      ) {
        console.warn("[UpdateService] Failed to fetch build manifest:", e);
      } else {
        console.warn(
          "[UpdateService] Unexpected error fetching build manifest:",
          e,
        );
      }
      return null;
    }
  }

  /**
   * 更新計画を生成
   * 現行の setUpdatePlan + detect/* を移植
   */
  generateUpdatePlan(
    buildManifest: BuildManifest,
    localManifest: LocalManifest | null,
  ): UpdatePlan {
    const buildFiles = buildManifest.files;
    const buildIds = Object.keys(buildFiles) as MapId[];

    if (!localManifest) {
      return {
        add: buildIds,
        update: [],
        delete: [],
      };
    }

    const localFiles = localManifest.files;
    const localIds = Object.keys(localFiles) as MapId[];

    // add detect
    const addList: MapId[] = buildIds.filter((id) => !localIds.includes(id));

    // delete detect
    const deleteList: MapId[] = localIds.filter((id) => !buildIds.includes(id));

    // update detect (sha256 or size mismatch)
    const intersection = localIds.filter((id) => buildIds.includes(id));
    const updateList: MapId[] = intersection.filter((id) => {
      const localItem = localFiles[id];
      const buildItem = buildFiles[id];
      if (!localItem || !buildItem) return false;
      if (localItem.size !== undefined && localItem.size !== buildItem.size) {
        return true;
      }
      if (
        localItem.sha256 !== undefined &&
        localItem.sha256 !== buildItem.sha256
      ) {
        return true;
      }
      return false;
    });

    return {
      add: addList,
      update: updateList,
      delete: deleteList,
    };
  }

  /**
   * 更新を実行（部分成功対応）
   * 現行の remoteApplyUpdatePlan → add/update/delete + downloadWithVerify を移植
   */
  async executeUpdate(
    plan: UpdatePlan,
    version: string,
    buildManifest: BuildManifest,
  ): Promise<UpdateResult[]> {
    const results: UpdateResult[] = [];
    const baseUrl = `${RELEASES_URL}/${version}/data`;

    // delete: 先に削除
    for (const mapId of plan.delete) {
      try {
        await this.repo.delete(mapId);
        results.push({ mapId, status: "success" });
      } catch (e) {
        const errMsg = e instanceof Error ? e.message : String(e);
        results.push({ mapId, status: "failed", error: errMsg });
        await this.repo.recordFailure(mapId, version, errMsg);
      }
    }

    // add + update: ダウンロード → 検証 → SQLite保存
    const downloadTargets = [...plan.add, ...plan.update];
    for (const mapId of downloadTargets) {
      try {
        const buildItem = buildManifest.files[mapId];
        if (!buildItem) {
          results.push({
            mapId,
            status: "skipped",
            error: `Not found in build manifest: ${mapId}`,
          });
          continue;
        }

        const url = `${baseUrl}/${buildItem.relativePath}`;
        const txt = await fetchTextWithRetry(url, 3);

        if (txt === null) {
          throw new NetworkError();
        }

        // size check
        const size = new TextEncoder().encode(txt).length;
        if (size !== buildItem.size) {
          throw new SizeMismatchError();
        }

        // sha256 check
        const hash = sha256(txt);
        if (hash !== buildItem.sha256) {
          throw new Sha256MismatchError();
        }

        const data = parseJson<FeatureCollection>(txt);

        // SQLite に保存
        await this.repo.upsert(mapId, data, {
          sha256: hash,
          size,
          version,
          source: "remote",
        });

        results.push({ mapId, status: "success" });
      } catch (e) {
        const errMsg = e instanceof Error ? e.message : String(e);
        console.warn(`[UpdateService] Failed to update ${mapId}: ${errMsg}`);
        results.push({ mapId, status: "failed", error: errMsg });
        await this.repo.recordFailure(mapId, version, errMsg);
        // 部分成功: 1ファイル失敗しても続行
      }
    }

    return results;
  }
}
