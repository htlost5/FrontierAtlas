import { fetchJsonWithRetry } from "@/src/infra/network/fetchJson";
import { LATEST_URL } from "../../urls";

type VersionConfig = {
  version: string;
  srcFolder: string;
};

export default async function getLatestVersion(): Promise<string | null> {
  const versionConfig = await fetchJsonWithRetry<VersionConfig>(LATEST_URL);
  
  if (!versionConfig) return null;

  return versionConfig.version;
}
