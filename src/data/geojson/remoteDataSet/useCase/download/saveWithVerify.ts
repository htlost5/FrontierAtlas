import {
  DownloadVerifyOptions,
  downloadWithVerify,
} from "./downloadWithVerify";

export async function saveJson({
  url,
  tmpPath,
  finalPath,
  expectedSize,
  expectedSha256,
  maxRetry,
}: DownloadVerifyOptions): Promise<{ size: number; hash: string }> {
  const { size, hash } = await downloadWithVerify({
    url,
    tmpPath,
    finalPath,
    expectedSize,
    expectedSha256,
    maxRetry,
  });
  return { size, hash };
}
