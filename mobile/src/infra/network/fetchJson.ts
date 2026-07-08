// fetchJson のインフラ層実装を提供する。
import { NetworkError, QuotaExceededError } from "@/src/domain/NetworkErrors";
import { safeFetch } from "./fetchWrapper";

type ResponseReader<T> = (res: Response) => Promise<T>;

async function fetchWithRetryCore<T>(
  url: string,
  readResponse: ResponseReader<T>,
  maxRetry = 3,
): Promise<T | null> {
  for (let i = 0; i < maxRetry; i++) {
    try {
      const res = await safeFetch(url);

      // クォータ超過 (Cloudflare Worker 503 + X-Quota-Exceeded header)
      if (res.status === 503 && res.headers.get("X-Quota-Exceeded") === "true") {
        const usage = res.headers.get("X-Quota-Usage") || "unknown";
        throw new QuotaExceededError(
          `Cloudflare quota exceeded. Usage: ${usage}. Service paused until next cycle.`
        );
      }

      // 404即終了
      if (res.status === 404) {
        console.warn(`404: ${url}`);
        return null;
      }

      if (res.ok) {
        // クォータ警告ログ
        if (res.headers.get("X-Quota-Warning") === "true") {
          const daily = res.headers.get("X-Quota-Daily") || "?";
          console.warn(`[QuotaWarning] Approaching limit (daily: ${daily})`);
        }
        return await readResponse(res);
      }

      if (res.status >= 500) {
        console.warn(`Retry ${i + 1}: ${url} (${res.status})`);
      } else {
        return null;
      }
    } catch (e) {
      if (e instanceof QuotaExceededError) throw e; // 再スロー
      console.warn(`Network error (retry ${i + 1}): ${url}`);
    }

    await new Promise((r) => setTimeout(r, 300 * 2 ** i));
  }

  throw new NetworkError(`Failed to fetch ${url}`);
}

export async function fetchJsonWithRetry<T>(
  url: string,
  maxRetry = 3,
): Promise<T | null> {
  return fetchWithRetryCore(url, (res) => res.json() as Promise<T>, maxRetry);
}

export async function fetchTextWithRetry(
  url: string,
  maxRetry = 3,
): Promise<string | null> {
  return fetchWithRetryCore(url, (res) => res.text(), maxRetry);
}
