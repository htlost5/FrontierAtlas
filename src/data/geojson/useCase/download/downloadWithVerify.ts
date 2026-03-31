import {
  Sha256MismatchError,
  SizeMismatchError,
} from "@/src/domain/ManifestErrors";
import { NetworkError } from "@/src/domain/NetworkErrors";
import {
  expoExists,
  expoMove,
  expoRemove,
  expoSize,
  expoWrite,
} from "@/src/infra/FileSystem/fileSystem";
import { fetchTextWithRetry } from "@/src/infra/network/fetchJson";
import { sha256 } from "@/src/infra/sha256/hashCheck";

export type DownloadVerifyOptions = {
  url: string;
  tmpPath: string;
  finalPath: string;
  expectedSize: number;
  expectedSha256: string;
  maxRetry: number;
};

type Result = {
  manifestText: string;
  size: number;
  hash: string;
};

export async function downloadWithVerify({
  url,
  tmpPath,
  finalPath,
  expectedSize,
  expectedSha256,
  maxRetry,
}: DownloadVerifyOptions): Promise<Result> {
  let lastError: Error | null = null;

  try {
    const txt = await fetchTextWithRetry(url, maxRetry);
    if (!txt) throw new NetworkError("fetch failed");

    expoWrite(tmpPath, txt);

    // size check
    const size = expoSize(tmpPath);
    if (size !== expectedSize) {
      throw new SizeMismatchError();
    }

    // sha256 check
    const hash = sha256(txt);
    if (hash !== expectedSha256) {
      throw new Sha256MismatchError();
    }

    expoMove(tmpPath, finalPath);

    return {
      manifestText: txt,
      size: size,
      hash: hash,
    };
  } catch (e) {
    if (expoExists(tmpPath)) {
      expoRemove(tmpPath);
    }
    lastError = e as Error;
  }

  throw lastError ?? new NetworkError("Download failed after retries");
}
