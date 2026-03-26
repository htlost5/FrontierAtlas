import { NetworkError } from "@/src/domain/NetworkErrors";
import { RELEASES_URL } from "../../urls";
import { Manifest } from "../manifestType";

import {
  Sha256MismatchError,
  SizeMismatchError,
  ValidationError,
  VersionMismatchError,
} from "@/src/domain/ManifestErrors";
import {
  expoMove,
  expoRemove,
  expoSize,
  expoWrite
} from "@/src/infra/FileSystem/fileSystem";
import { parseJson } from "@/src/infra/jsonParse/jsonParser";
import {
  fetchJsonWithRetry,
  fetchTextWithRetry,
} from "@/src/infra/network/fetchJson";
import { sha256 } from "@/src/infra/sha256/hashCheck";

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

  const maxRetry = 3;
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetry; i++) {
    // remoteManifest取得（txt）
    const remoteManifestText = await fetchTextWithRetry(MANIFEST_URL);

    if (!remoteManifestText) {
      throw new NetworkError("Failed to fetch remote manifest");
    }

    // remoteManifestをローカルへ保存 -> ファイルサイズ取得のため
    expoWrite(MANIFEST_TMP_PATH, remoteManifestText);

    // size一致確認（リトライする）
    const remoteManifestSize = expoSize(MANIFEST_TMP_PATH);
    console.log(
      `remoteManifest: ${remoteManifestSize}, versionSize: ${versionInfo.manifestSize}`,
    );

    if (versionInfo.manifestSize !== remoteManifestSize) {
      expoRemove(MANIFEST_TMP_PATH);
      lastError = new SizeMismatchError();
      continue;
    }

    // sha256検証
    const remoteManifestSha256 = sha256(remoteManifestText);
    if (versionInfo.manifestSha256 !== remoteManifestSha256) {
      expoRemove(MANIFEST_TMP_PATH);
      lastError = new Sha256MismatchError();
      continue;
    }

    try {
      const remoteManifest: Manifest = parseJson(remoteManifestText);
      if (versionInfo.version !== remoteManifest.version) {
        throw new VersionMismatchError();
      }
      
      expoMove(MANIFEST_TMP_PATH, MANIFEST_PATH);
      return remoteManifest;

    } catch(e) {
      expoRemove(MANIFEST_TMP_PATH);
      lastError = new ValidationError("JSON parse error");
      continue
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new ValidationError("Unknown validation error");
}

// versionInfo, manifestを取得
// versionInfoのバージョンを確認 -> size確認 -> sha256確認
