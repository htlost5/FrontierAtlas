import { NetworkError } from "@/src/domain/NetworkErrors";
import { safeFetch } from "./fetchWrapper";

export async function fetchJsonWithRetry<T>(
  url: string,
  maxRetry = 3,
): Promise<T | null> {
  for (let i = 0; i < maxRetry; i++) {
    try {
      const res = await safeFetch(url);

      // 404即終了
      if (res.status === 404) {
        console.warn(`404: ${url}`);
        return null;
      }

      if (res.ok) {
        return await res.json();
      }

      if (res.status >= 500) {
        console.warn(`Retry ${i + 1}: ${url} (${res.status})`);
      } else {
        return null;
      }
    } catch {
      console.warn(`Network error (retry ${i + 1}): ${url}`);
    }

    await new Promise((r) => setTimeout(r, 300 * 2 ** i));
  }

  throw new NetworkError(`Failed to fetch ${url}`);
}

export async function fetchTextWithRetry(
  url: string,
  maxRetry = 3,
): Promise<string | null> {
  for (let i = 0; i < maxRetry; i++) {
    try {
      const res = await safeFetch(url);

      // 404即終了
      if (res.status === 404) {
        console.warn(`404: ${url}`);
        return null;
      }

      if (res.ok) {
        return await res.text();
      }

      if (res.status >= 500) {
        console.warn(`Retry ${i + 1}: ${url} (${res.status})`);
      } else {
        return null;
      }
    } catch {
      console.warn(`Network error (retry ${i + 1}): ${url}`);
    }

    await new Promise((r) => setTimeout(r, 300 * 2 ** i));
  }

  throw new NetworkError(`Failed to fetch ${url}`);
}
