import { NetworkError } from "@/src/domain/NetworkErrors";
import { RELEASES_URL } from "../../urls";
import { Manifest } from "../manifestType";

import { VersionMismatchError } from "@/src/domain/ManifestErrors";
import { parseJson } from "@/src/infra/jsonParse/jsonParser";
import { fetchJsonWithRetry } from "@/src/infra/network/fetchJson";
import { downloadWithVerify } from "@/src/data/geojson/useCase/downloadWithVerify";

type VersionInfo = {
  version: string;
  manifestSha256: string;
  manifestSize: number;
};

export default async function setBuildManifest(
  version: string,
): Promise<Manifest> {
  let versionInfo: VersionInfo | null = null;

  const VERSIONINFO_URL = `${RELEASES_URL}/${version}/data/version.json`;
  const MANIFEST_URL = `${RELEASES_URL}/${version}/data/manifest.json`;

  const MANIFEST_PATH = "data/remoteManifest.json";
  const MANIFEST_TMP_PATH = `${MANIFEST_PATH}.tmp`;

  // versionInfo取得
  versionInfo = await fetchJsonWithRetry<VersionInfo>(VERSIONINFO_URL);
  if (!versionInfo) {
    throw new NetworkError("Failed to fetch versionInfo");
  }

  const manifestText = await downloadWithVerify({
    url: MANIFEST_URL,
    tmpPath: MANIFEST_TMP_PATH,
    finalPath: MANIFEST_PATH,
    expectedSize: versionInfo.manifestSize,
    expectedSha256: versionInfo.manifestSha256,
    maxRetry: 3,
  });

  const remoteManifest: Manifest = parseJson(manifestText);

  // version 一致確認

  if (versionInfo.version !== remoteManifest.version) {
    throw new VersionMismatchError();
  }

  return remoteManifest;
}

// versionInfo, manifestを取得
// versionInfoのバージョンを確認 -> size確認 -> sha256確認
