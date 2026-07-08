// R2 + Worker 経由のURL
// Worker が R2 バケットへのプロキシとして機能する
// Worker proxy is deployed — provides CORS, Cache-Control, and quota management.
export const REMOTE_BASE_URL = "https://geo-data-push.htlost8.workers.dev/data";

export const LATEST_URL = `${REMOTE_BASE_URL}/meta/latest.json`;
export const RELEASES_URL = `${REMOTE_BASE_URL}/releases`;
