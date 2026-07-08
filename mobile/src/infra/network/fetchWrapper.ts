// フェッチ処理に共通オプションを適用するネットワークラッパーです。
import { Platform } from "react-native";

/**
 * fetch に共通オプションを適用したラッパーを返します。
 * - Android 実機では AbortSignal.timeout() が Hermes で未対応のため手動 AbortController を使用
 * - Android 実機では fetch ポリフィルの制約から cache: "default" を使用
 * @param url 取得対象 URL。
 * @param options 呼び出し側から追加指定する fetch オプション。
 * @param timeoutMs タイムアウト時間（ミリ秒）。既定は 30000ms。
 * @returns fetch の `Response`。
 */
export async function safeFetch(
  url: string,
  options?: RequestInit,
  timeoutMs: number = 30000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const overrideOption: RequestInit = {
      cache: Platform.OS === "android" ? "default" : "no-cache",
      signal: controller.signal,
      ...options,
    };
    return await fetch(url, overrideOption);
  } finally {
    clearTimeout(timer);
  }
}
