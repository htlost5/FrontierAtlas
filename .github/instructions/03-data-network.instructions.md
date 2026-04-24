---
applyTo: "src/data/geojson/**,src/infra/network/**,src/infra/FileSystem/**,src/infra/sha256/**"
---

# データ更新 / 通信 / 検証ルール

## 通信

- `safeFetch` / `fetchJsonWithRetry` / `fetchTextWithRetry` の既存パターンを優先する。
- 404 は即 `null`、ネットワーク障害/5xx は再試行という既存仕様を崩さない。

## 完全性検証

- ダウンロード後は `size` と `sha256` を必ず検証する。
- 不整合時は反映せず、既存の fallback 方針を維持する。

## エラー型

- `NetworkError` / `VersionFetchError` / `SizeMismatchError` / `Sha256MismatchError` / `VersionMismatchError` を再利用する。

## レジストリ

- `updateRegistry` 経由の再登録フローを保つ。
- 生成ファイル `geojsonAssetMap.ts` の手編集は禁止。
