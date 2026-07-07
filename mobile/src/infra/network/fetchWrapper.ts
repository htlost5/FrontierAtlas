// フェッチ処理に共通オプションを適用し、必要時にオフライン疑似再現できるネットワークラッパーです。
const SIMULATE_OFFLINE = false;

/**
 * fetch に no-cache を既定適用した共通ラッパーを返します。
 * @param url 取得対象 URL。
 * @param options 呼び出し側から追加指定する fetch オプション。
 * @returns fetch の `Response`。
 */
export async function safeFetch(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  if (SIMULATE_OFFLINE) {
    throw new Error("Simulated offline network error");
  }

  const overrideOption: RequestInit = {
    cache: "no-cache",
    ...options,
  };

  return fetch(url, overrideOption);
}
