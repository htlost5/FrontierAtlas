// SQLite データアクセス層
// expo-sqlite を使用した GeoJSON データの永続化を担当

import {
  openDatabaseAsync,
  type SQLiteDatabase,
} from "expo-sqlite";
import type { FeatureCollection } from "geojson";
import { sha256 } from "@/src/infra/sha256/hashCheck";
import { parseJson, stringifyJson } from "@/src/infra/jsonParse/jsonParser";
import type {
  GeoJsonRow,
} from "@/src/data/geojson/types";
import type {
  LocalManifest,
} from "@/src/domain/manifestTypes";
import { expoRead } from "@/src/infra/FileSystem/fileSystem";
import { LOCAL_MANIFEST_PATH } from "@/src/data/paths";

const DB_NAME = "geojson.db";

/** upsert 用メタデータ */
export type UpsertMeta = {
  sha256: string;
  size: number;
  version: string;
  source: "remote" | "asset";
};

/**
 * GeojsonRepository
 *
 * シングルトンパターン。モジュールレベルで 1 インスタンス。
 * 全メソッドはインスタンスメソッドとして公開し、外部からは
 * GeojsonRepository.getInstance() でアクセスする。
 */
export class GeojsonRepository {
  private static instance: GeojsonRepository;
  private db: SQLiteDatabase | null = null;

  private constructor() {}

  /** シングルトンインスタンス取得 */
  static getInstance(): GeojsonRepository {
    if (!GeojsonRepository.instance) {
      GeojsonRepository.instance = new GeojsonRepository();
    }
    return GeojsonRepository.instance;
  }

  /** DB を開き、テーブルを作成・マイグレーションを実行 */
  async initialize(): Promise<void> {
    this.db = await openDatabaseAsync(DB_NAME);

    // WAL モード有効化
    await this.db.execAsync("PRAGMA journal_mode = WAL;");

    // メインテーブル
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS geojson_data (
        map_id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        sha256 TEXT NOT NULL,
        size INTEGER NOT NULL,
        version TEXT NOT NULL,
        source TEXT NOT NULL CHECK(source IN ('remote','asset')),
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    // local_manifest テーブル（key-value ストア）
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS local_manifest (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    // failed_updates テーブル（部分成功用）
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS failed_updates (
        map_id TEXT PRIMARY KEY,
        version TEXT NOT NULL,
        error TEXT NOT NULL,
        failed_at INTEGER NOT NULL
      );
    `);

    // 起動時クリーンアップ: source='tmp' のエントリを削除（旧システムの残骸）
    // 該当するエントリがないためスキップ。将来の拡張用にコメントのみ記録

    // 旧 localManifest.json のマイグレーションチェック
    await this.migrateLegacyLocalManifest();
  }

  /** 単一レコード取得。sha256 検証付き */
  async get(mapId: string): Promise<FeatureCollection | undefined> {
    const db = this.getDb();
    const row = await db.getFirstAsync<GeoJsonRow>(
      "SELECT * FROM geojson_data WHERE map_id = ?",
      [mapId],
    );
    if (!row) return undefined;

    // sha256 検証
    const hash = sha256(row.data);
    if (hash !== row.sha256) {
      console.warn(
        `[GeojsonRepository] sha256 mismatch for ${mapId}, deleting corrupted entry`,
      );
      await this.delete(mapId);
      return undefined;
    }

    return parseJson<FeatureCollection>(row.data);
  }

  /** 複数レコード取得 */
  async getMany(mapIds: string[]): Promise<Map<string, FeatureCollection>> {
    if (mapIds.length === 0) return new Map();

    const db = this.getDb();
    const placeholders = mapIds.map(() => "?").join(",");
    const rows = await db.getAllAsync<GeoJsonRow>(
      `SELECT * FROM geojson_data WHERE map_id IN (${placeholders})`,
      mapIds,
    );

    const result = new Map<string, FeatureCollection>();
    for (const row of rows) {
      const hash = sha256(row.data);
      if (hash !== row.sha256) {
        console.warn(
          `[GeojsonRepository] sha256 mismatch for ${row.map_id} in getMany, deleting`,
        );
        await this.delete(row.map_id);
        continue;
      }
      result.set(row.map_id, parseJson<FeatureCollection>(row.data));
    }
    return result;
  }

  /** INSERT OR REPLACE */
  async upsert(
    mapId: string,
    data: FeatureCollection,
    meta: UpsertMeta,
  ): Promise<void> {
    const db = this.getDb();
    const json = stringifyJson(data);
    const now = Date.now();

    await db.runAsync(
      `INSERT OR REPLACE INTO geojson_data (map_id, data, sha256, size, version, source, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, COALESCE((SELECT created_at FROM geojson_data WHERE map_id = ?), ?), ?)`,
      [
        mapId,
        json,
        meta.sha256,
        meta.size,
        meta.version,
        meta.source,
        mapId, // created_at 取得用
        now, // created_at フォールバック
        now, // updated_at
      ],
    );
  }

  /** トランザクション内で一括 upsert */
  async upsertMany(
    rows: {
      mapId: string;
      data: FeatureCollection;
      meta: UpsertMeta;
    }[],
  ): Promise<void> {
    const db = this.getDb();
    await db.withTransactionAsync(async () => {
      for (const row of rows) {
        await this.upsert(row.mapId, row.data, row.meta);
      }
    });
  }

  /** 削除 */
  async delete(mapId: string): Promise<void> {
    const db = this.getDb();
    await db.runAsync("DELETE FROM geojson_data WHERE map_id = ?", [mapId]);
  }

  /** 全件削除 */
  async deleteAll(): Promise<void> {
    const db = this.getDb();
    await db.runAsync("DELETE FROM geojson_data");
  }

  /** 存在確認 */
  async exists(mapId: string): Promise<boolean> {
    const db = this.getDb();
    const row = await db.getFirstAsync<{ cnt: number }>(
      "SELECT COUNT(*) as cnt FROM geojson_data WHERE map_id = ?",
      [mapId],
    );
    return (row?.cnt ?? 0) > 0;
  }

  /** local_manifest から復元 */
  async getLocalManifest(): Promise<LocalManifest | null> {
    const db = this.getDb();
    const row = await db.getFirstAsync<{ value: string }>(
      "SELECT value FROM local_manifest WHERE key = 'manifest'",
    );
    if (!row) return null;

    try {
      return parseJson<LocalManifest>(row.value);
    } catch {
      // 破損していた場合削除
      await db.runAsync(
        "DELETE FROM local_manifest WHERE key = 'manifest'",
      );
      return null;
    }
  }

  /** local_manifest に保存 */
  async setLocalManifest(manifest: LocalManifest): Promise<void> {
    const db = this.getDb();
    const json = stringifyJson(manifest);
    await db.runAsync(
      "INSERT OR REPLACE INTO local_manifest (key, value) VALUES ('manifest', ?)",
      [json],
    );
  }

  /** source カラム取得 */
  async getSource(mapId: string): Promise<"remote" | "asset" | null> {
    const db = this.getDb();
    const row = await db.getFirstAsync<{ source: string }>(
      "SELECT source FROM geojson_data WHERE map_id = ?",
      [mapId],
    );
    if (!row) return null;
    if (row.source !== "remote" && row.source !== "asset") return null;
    return row.source as "remote" | "asset";
  }

  /** failed_updates に記録 */
  async recordFailure(
    mapId: string,
    version: string,
    error: string,
  ): Promise<void> {
    const db = this.getDb();
    const now = Date.now();
    await db.runAsync(
      `INSERT OR REPLACE INTO failed_updates (map_id, version, error, failed_at)
       VALUES (?, ?, ?, ?)`,
      [mapId, version, error, now],
    );
  }

  /** 失敗一覧取得 */
  async getFailures(): Promise<
    { mapId: string; version: string; error: string; failedAt: number }[]
  > {
    const db = this.getDb();
    const rows = await db.getAllAsync<{
      map_id: string;
      version: string;
      error: string;
      failed_at: number;
    }>("SELECT * FROM failed_updates");
    return rows.map((r) => ({
      mapId: r.map_id,
      version: r.version,
      error: r.error,
      failedAt: r.failed_at,
    }));
  }

  /** 失敗クリア */
  async clearFailures(): Promise<void> {
    const db = this.getDb();
    await db.runAsync("DELETE FROM failed_updates");
  }

  /**
   * cleanupOrphans: source='remote' で local_manifest に存在しないエントリを削除
   */
  async cleanupOrphans(): Promise<number> {
    const localManifest = await this.getLocalManifest();
    const db = this.getDb();
    const rows = await db.getAllAsync<{ map_id: string }>(
      "SELECT map_id FROM geojson_data WHERE source = 'remote'",
    );

    let deletedCount = 0;
    for (const row of rows) {
      if (
        !localManifest ||
        !localManifest.files ||
        !localManifest.files[row.map_id]
      ) {
        await this.delete(row.map_id);
        deletedCount++;
      }
    }
    return deletedCount;
  }

  /**
   * 旧 localManifest.json から SQLite へのマイグレーション
   * 初回起動時に expo-file-system 上の旧 localManifest.json が存在したら移行する
   */
  private async migrateLegacyLocalManifest(): Promise<void> {
    try {
      // 既存の local_manifest があればスキップ
      const existing = await this.getLocalManifest();
      if (existing) return;

      // expo-file-system 経由で旧 localManifest.json をチェック
      let legacyText: string;
      try {
        legacyText = await expoRead(LOCAL_MANIFEST_PATH);
      } catch {
        // 旧ファイルが存在しない => マイグレーション不要
        return;
      }

      const legacyManifest = parseJson<LocalManifest>(legacyText);
      if (legacyManifest) {
        await this.setLocalManifest(legacyManifest);
        console.log(
          "[GeojsonRepository] Migrated legacy localManifest.json to SQLite",
        );
      }
    } catch (e) {
      // マイグレーション失敗は致命的ではない。次回起動時に再試行
      console.warn(
        "[GeojsonRepository] Legacy manifest migration failed:",
        e,
      );
    }
  }

  /** 内部: 初期化済み DB インスタンスを取得 */
  private getDb(): SQLiteDatabase {
    if (!this.db) {
      throw new Error(
        "GeojsonRepository not initialized. Call initialize() first.",
      );
    }
    return this.db;
  }
}
