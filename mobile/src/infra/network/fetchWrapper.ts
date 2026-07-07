// フェッチ処理に共通オプションを適用するネットワークラッパーです。
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
  const overrideOption: RequestInit = {
    cache: "no-cache",
    ...options,
  };

  return fetch(url, overrideOption);
}
