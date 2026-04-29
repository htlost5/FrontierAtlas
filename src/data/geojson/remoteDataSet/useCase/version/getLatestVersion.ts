// getLatestVersion のGeoJSONデータ処理を定義する。
import { LATEST_URL } from "@/src/data/urls";
import { fetchJsonWithRetry } from "@/src/infra/network/fetchJson";

type VersionConfig = {
  version: string;
  srcFolder: string;
};

export default async function getLatestVersion(): Promise<string> {
  const versionConfig = await fetchJsonWithRetry<VersionConfig>(LATEST_URL);
  if (!versionConfig) {
    throw new Error("Failed to fetch versionConfig");
  }

  return versionConfig.version;
}
