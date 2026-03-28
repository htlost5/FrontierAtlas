import { fetchJsonWithRetry } from "@/src/infra/network/fetchJson";
import { LATEST_URL } from "../../urls";

type VersionConfig = {
  version: string;
  srcFolder: string;
};

export default async function getLatestVersion(): Promise<string | null> {
  try {
    const versionConfig = await fetchJsonWithRetry<VersionConfig>(LATEST_URL);
    if (!versionConfig) {
      throw new Error("Failed to fetch versionConfig");
    }

    return versionConfig.version;

  } catch (e) {
    throw new Error("unknown fetch latest error");
  }
}
