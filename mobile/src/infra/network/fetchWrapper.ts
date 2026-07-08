// フェッチ処理に共通オプションを適用するネットワークラッパーです。
/**
 * fetch に no-cache を既定適用した共通ラッパーを返します。
 * @param url 取得対象 URL。
 * @param options 呼び出し側から追加指定する fetch オプション。
 * @param timeoutMs タイムアウト時間（ミリ秒）。既定は 15000ms。
 * @returns fetch の `Response`。
 */
export async function safeFetch(
  url: string,
  options?: RequestInit,
  timeoutMs: number = 15000,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const overrideOption: RequestInit = {
      signal: controller.signal,
      ...options,
    };
    return await fetch(url, overrideOption);
  } finally {
    clearTimeout(timeoutId);
  }
}
