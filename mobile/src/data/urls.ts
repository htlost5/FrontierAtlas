// R2 + Worker 経由のURL
// Worker が R2 バケットへのプロキシとして機能する
// TODO: Switch to Worker proxy URL once the proxy is deployed.
// The proxy provides auth, quota management, and caching headers.
// Proxy path TBD — update this after proxy deployment.
export const REMOTE_BASE_URL = "https://pub-d8f5948d1eee41aea5ea49d6578710cb.r2.dev";
// R2 公開アクセス有効化後はカスタムドメインに切り替え:
// export const REMOTE_BASE_URL = "https://geo-data.frontieratlas.dev";

export const LATEST_URL = `${REMOTE_BASE_URL}/meta/latest.json`;
export const RELEASES_URL = `${REMOTE_BASE_URL}/releases`;
