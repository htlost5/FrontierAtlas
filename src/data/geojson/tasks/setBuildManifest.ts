import assetManifest from "@/assets/data/manifest.json";
import { RELEASES_URL } from "../../urls";
import { Manifest } from "../manifestType";
import { safeFetch } from "@/src/infra/network/fetchWrapper";

export default async function setBuildManifest(
  version: string | null,
): Promise<Manifest> {
  let buildManifest = assetManifest;

  if (version) {
    try {
      const MANIFEST_URL = `${RELEASES_URL}/${version}/data/manifest.json`;
      const manifestResponse = await safeFetch(MANIFEST_URL, { cache: "no-store" });

      if (!manifestResponse.ok) {
        console.warn(
          `Failed to fetch remote manifest: ${manifestResponse.status}`,
        );
      } else {
        buildManifest = await manifestResponse.json();
        // console.log("success to fetch manifest");
      }
    } catch (e) {
      console.warn(
        `NetWork error while fetching remote manifest: ${(e as Error).message}`,
      );
    }
  }

  return buildManifest;
}
