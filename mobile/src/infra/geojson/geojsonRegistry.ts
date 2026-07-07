// geojsonRegistry のインフラ層実装を提供する。
// 従来のインメモリ Map から SQLite バックエンドに移行

import type { FeatureCollection } from "geojson";
import { GeojsonRepository } from "@/src/data/geojson/repository/GeojsonRepository";
import { sha256 } from "@/src/infra/sha256/hashCheck";
import { stringifyJson } from "@/src/infra/jsonParse/jsonParser";

export const geojsonRegistry = {
  async get(id: string): Promise<FeatureCollection | undefined> {
    return GeojsonRepository.getInstance().get(id);
  },

  async set(id: string, data: FeatureCollection): Promise<void> {
    const json = stringifyJson(data);
    const hash = sha256(json);
    const size = new TextEncoder().encode(json).length;
    await GeojsonRepository.getInstance().upsert(id, data, {
      sha256: hash,
      size,
      version: "manual",
      source: "remote",
    });
  },

  async has(id: string): Promise<boolean> {
    return GeojsonRepository.getInstance().exists(id);
  },

  async delete(id: string): Promise<void> {
    return GeojsonRepository.getInstance().delete(id);
  },

  async clear(): Promise<void> {
    return GeojsonRepository.getInstance().deleteAll();
  },
};
