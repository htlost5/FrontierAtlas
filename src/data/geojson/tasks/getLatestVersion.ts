import { safeFetch } from "@/src/infra/network/fetchWrapper";
import { LATEST_URL } from "../../urls";

export default async function getLatestVersion(): Promise<string | null> {
  let version = null;
  try {
    const latestRes = await safeFetch(LATEST_URL, { cache: "no-store" });
    if (!latestRes.ok) {
      return null;
    }
    const latestConfig = await latestRes.json();
    version = latestConfig.version ?? null;
  } catch (e) {
    console.warn(
      `NetWork error while fetching remote Latest Version: ${(e as Error).message}`,
    );
  }
  return version;
}
