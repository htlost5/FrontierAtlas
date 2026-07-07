// NetworkErrors のドメインエラー/型を定義する。
export class NetworkError extends Error {}

/** クォータ超過: Cloudflare 無料枠上限により配信が一時停止中 */
export class QuotaExceededError extends Error {
  constructor(message = "Quota exceeded. Service temporarily paused.") {
    super(message);
    this.name = "QuotaExceededError";
  }
}
