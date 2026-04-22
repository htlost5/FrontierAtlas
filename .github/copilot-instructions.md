# copilot-instructions.md

## 1. ドキュメントのメタ情報

- 目的:
  - このリポジトリで AI ツール（GitHub Copilot / Claude / ChatGPT）が、既存設計を壊さずに変更を提案・実装できるようにする。
  - 探索コストを下げ、ビルド失敗や設計逸脱を減らす。
- 利用方法:
  - 変更前に本ドキュメントを読み、対象機能の責務レイヤーと既存命名を合わせる。
  - 迷った場合は「新規方式追加」ではなく「既存パターン踏襲」を優先する。
- 前提条件:
  - 言語: TypeScript（strict）
  - 実行基盤: Expo SDK 55 / React Native / Expo Router
  - 主要制約: `src/data/geojson/geojsonAssetMap.ts` は自動生成ファイル
- 最終更新日: 2026-04-22
- 更新ルール:
  - 依存パッケージ更新、アーキテクチャ変更、コマンド変更時に本ファイルを更新する。
  - 更新時は「変更理由」と「影響範囲」を必ず追記する（このファイル末尾の更新履歴を使用）。

---

## 2. プロジェクト概要

- アプリの目的:
  - 屋内マップ（IMDF/GeoJSON）を表示し、階層切替・検索 UI・外部リンク（例: classroom）を提供する Expo アプリ。
- 主要機能:
  1. Expo Router によるタブ画面遷移
  2. MapLibre での地図描画（venue/buildings/floor レイヤー）
  3. ネットワーク状態監視（オンライン/オフライン）
  4. GeoJSON データ更新（remote -> asset フォールバック）
  5. ローカル保存と整合性検証（size/sha256）
- ターゲットユーザー/ユースケース:
  - 学内/施設利用者が建物・フロアを視覚的に確認する用途。
- 技術選定の理由（推定）:
  - Expo + Expo Router: マルチプラットフォームと file-based routing
  - MapLibre: 地図レイヤー制御の自由度
  - expo-file-system: オフラインキャッシュ
  - sha256 検証: 配信データの破損検知

---

## 3. 技術スタック詳細

- 言語/型:
  - TypeScript `^5.9.3`（`strict: true`）
- フレームワーク:
  - Expo `^55.0.15`
  - React `19.2.0`
  - React Native `0.83.4`
- ルーティング:
  - Expo Router `~55.0.12`（`app/` 配下 file-based routing）
- 地図:
  - `@maplibre/maplibre-react-native` `^10.4.0`
- 状態管理:
  - React Context + `useState`（Redux/Zustand 未導入）
- ネットワーク:
  - `@react-native-community/netinfo` `11.5.2`
  - fetch ラッパー + retry（独自実装）
- ファイルシステム:
  - `expo-file-system` `~55.0.16`
- ハッシュ:
  - `@noble/hashes` `^2.0.1`
- UI/ナビ:
  - `@react-navigation/*` 群（Expo Router 基盤）
  - `@expo/vector-icons`
- ビルド/配布:
  - EAS Build (`eas.json`: development / preview / production)
- リンター:
  - ESLint 9 + `eslint-config-expo/flat`
- フォーマッター:
  - Prettier 設定ファイルなし（ESLint/既存スタイル準拠）
- テスト:
  - 専用テストフレームワーク未構成（`test` スクリプトなし）
- パッケージマネージャー:
  - npm（`package-lock.json` あり）

---

## 4. プロジェクト構造

```text
app/                      # Expo Router 画面ルート
  _layout.tsx             # ルートレイアウト（Provider/SafeArea/Stack）
  AppInit.tsx             # 初期化ラッパー
  (tabs)/                 # タブ配下ルート
src/
  AppInit/                # 起動初期化（font/data）
  features/home/map/      # 地図機能（画面/レイヤー/hooks/context）
  features/home/search/   # 検索 Context
  data/geojson/           # manifest/update/usecase
  infra/                  # FS/Network/JSON/Registry/SHA
  domain/                 # エラー型
  shared/                 # 共通 UI / ナビ / サービス
assets/data/imdf/         # GeoJSON データ
scripts/                  # 生成・データ更新スクリプト
config/                   # geo-data-version.json
docs/requirements/        # 設計メモ/要件
.github/                  # AI 指示・プロンプト
```

- 依存方向（原則）:
  - `features` -> `data/infra/domain/shared`
  - `data` -> `infra/domain`
  - `infra` は低レベル実装層
- 機能追加時の配置:
  - UI: `src/features/<feature>/...`
  - API/永続化: `src/data` or `src/infra`
  - 再利用 UI: `src/shared/components`
  - エラー型: `src/domain`

---

## 5. アーキテクチャ設計

- 全体パターン:
  - **ハイブリッド**（route-based + feature-based + layer-based）
- 採用理由:
  - 画面ルーティングは `app/`、業務ロジックは `src/` に分離しやすい。
- コンポーネント設計:
  - `MapRoot` が状態と `MapContext` を提供し、`MapScreen` は描画に集中。
  - レイヤーは `VenueView` / `BuildingsView` / `FloorView` に分割。
- データフロー（要約）:
  1. `AppInit` で `usePrepareApp()` と `usePrepareData()`
  2. `loadAllGeoJson(isOffline)`
  3. remote 取得失敗時は asset にフォールバック
  4. registry へ登録
  5. map hooks が registry から参照して表示
- DI:
  - DI コンテナ未導入。Context と hook 注入で代替。

---

## 6. 命名規則とコーディング規約

- ファイル名:
  - React コンポーネント: `PascalCase.tsx`（例: `MapScreen.tsx`）
  - hook: `useXxx.ts`
  - util/config: `camelCase.ts` または `index.ts`
- シンボル:
  - コンポーネント/型: PascalCase
  - 関数/変数: camelCase
  - 定数: UPPER_SNAKE_CASE or `const object`
- export 方針:
  - 機能単位で `default export` と `named export` が混在。既存ファイルに合わせる。
- コメント:
  - 日本語コメントが多い。新規コメントも日本語で簡潔に。
- import:
  - `@/` エイリアス（tsconfig paths）を優先。
- 非同期:
  - `async/await` が基本。`retry` は指数バックオフ実装あり。

---

## 7. TypeScript/型システムの使用方法

- `strict: true` を前提に実装する。
- `any` の新規導入は原則禁止。
  - 不明値は `unknown` + 型ガードで扱う。
- 型定義配置:
  - ドメイン型: `src/data/geojson/manifestType.ts` など
  - グローバル宣言: `types/`
- ジェネリクス:
  - `fetchJsonWithRetry<T>()` のように利用。
- 推奨:
  - API の返却・引数は明示型を付ける。
  - `MapId`（`geojsonAssetMap.ts`）を ID の正型として使う。

---

## 8. コンポーネント/モジュール設計ガイド

- 責務分離:
  - Container: `TabController`, `MapRoot`
  - Presentational: `TabBar`, レイヤー View 群
- `props` 設計:
  - `null` 許容は早期 return (`if (!data) return null`) で処理。
- hooks:
  - `useMapContext()` のように Provider 外使用を例外で防止。
- ErrorBoundary/Suspense:
  - 現状未導入。将来導入時は `app/_layout.tsx` 配下で統一管理。

---

## 9. 状態管理の実装パターン

- ローカル状態:
  - `useState`（例: floor, zoom, ready フラグ）
- グローバル状態:
  - Context (`MapContext`, `SearchContext`, `NetworkContext`)
- サーバー状態:
  - カスタム fetch + ローカル manifest/registry（React Query 未使用）
- 永続化:
  - `expo-file-system` に manifest と geojson を保存
- 楽観的更新:
  - 未実装（必要時は manifest 更新整合性を優先）

---

## 10. API通信とデータ管理

- HTTP クライアント:
  - `safeFetch()` + `fetchJsonWithRetry()` / `fetchTextWithRetry()`
- エラーハンドリング:
  - `NetworkError`, `VersionFetchError`, `SizeMismatchError`, `Sha256MismatchError` 等の独自エラー
- retry:
  - 最大 `maxRetry`、待機 `300 * 2^i` ms
- データ検証:
  - download 後に size/sha256 を検証し、`tmp -> final` 移動
- オフライン対応:
  - remote 失敗時 `asset` へフォールバック
- 重要:
  - 直接 `fetch` せず、既存ラッパー経由を優先

---

## 11. スタイリングガイドライン

- 基本:
  - `StyleSheet.create` を使用
  - `Platform.select` で `android/ios/web` 差分調整
- デザイン:
  - ハードコード色が多い。新規実装は既存トーンに合わせる。
- レスポンシブ:
  - 固定値多め（例: search width 400）。改善時は影響範囲を検証。
- テーマ:
  - 専用トークン管理未導入。導入時は `src/shared` に集約する。

---

## 12. テスト戦略

- 現状:
  - Jest/Vitest 等の明示導入なし。`test` スクリプトなし。
- 方針:
  - 変更時は最低限 `lint` と `expo start` 動作確認を行う。
- 推奨追加:
  - unit: `infra`（fetch/json/hash/fs）
  - integration: `loadAllGeoJson` の remote/asset 分岐
  - e2e: ルート遷移と地図表示

---

## 13. パフォーマンス最適化

- 現在の工夫:
  - `geojsonRegistry` によるメモリキャッシュ
  - `MapRoot` / `TabItem` で `memo` 利用
  - route 分割（Expo Router）
- 実装時の基準:
  - 高コスト計算は `useMemo`、ハンドラは `useCallback`
  - 地図レイヤー更新は必要最小限にする
- 目標（推奨）:
  - 初回描画遅延を増やす変更を避ける

---

## 14. アクセシビリティ

- 現状:
  - 一部で `accessibilityRole/Label` のみ実装（例: `TabItem`）
- 追加実装時の基準:
  - タップ可能要素に label を付与
  - 色だけで状態を表現しない
  - 文字サイズ固定を避ける
- 目標:
  - WCAG 2.1 AA 相当を目指す（新規 UI から適用）

---

## 15. セキュリティとプライバシー

- 環境変数:
  - `.env*.local` は Git 管理対象外（`.gitignore`）
- 外部リンク:
  - `launchExternalApp.ts` の許可リスト方式を維持
- データ整合性:
  - sha256/size 検証を無効化しない
- 禁止:
  - API キーや個人情報をソース/コメントに埋め込まない

---

## 16. ビルドとデプロイ

- 主要コマンド:
  - install: `npm install`
  - run: `npx expo start`
  - lint: `npm run lint`
  - android: `npm run android`
  - web: `npm run web`
- EAS build profiles:
  - `development`, `preview`, `production`（`eas.json`）
- OTA updates:
  - `app.config.ts` の `updates.enabled` は preview/production で有効
- CI/CD:
  - リポジトリ内に GitHub Actions 設定は未確認（`.github/workflows` なし）

---

## 17. 実装例とパターン集

### 典型的コンテキスト hook

```ts
export function useMapContext(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMapContext must be used within MapRoot");
  return ctx;
}
```

### API retry パターン

```ts
for (let i = 0; i < maxRetry; i++) {
  try {
    /* fetch */
  } catch {}
  await new Promise((r) => setTimeout(r, 300 * 2 ** i));
}
```

### レイヤー描画パターン

```tsx
if (!data) return null;
return <PolygonLayer prefixId="venue" data={data} ... />;
```

### 初期化パターン

```tsx
const baseReady = usePrepareApp();
const dataReady = usePrepareData(baseReady);
```

---

## 18. アンチパターン集

- `geojsonAssetMap.ts` を手編集する（自動生成破壊）
- Provider 外で Context hook を使う
- `fetch` を直接乱立し retry/エラー統一を崩す
- `any` の追加で strict 型安全を下げる
- 地図描画処理に重い同期処理を埋め込む
- `.tmp` なしの直接上書きで破損時復旧不能にする
- ID 文字列を雑に書いて `MapId` 整合を崩す

---

## 19. トラブルシューティング

- 症状: GeoJSON 読み込み失敗
  - 確認: `relativePath` と `MapId` の整合
  - 確認: `imdf/` 接頭辞の有無
- 症状: データ更新後に表示されない
  - 確認: `updateRegistry()` が呼ばれているか
  - 確認: `geojsonRegistry` が `clear` 後に再登録されているか
- 症状: ルート遷移が期待外
  - 確認: `ROUTE_MAP` と `pathname` 判定
- 症状: 型エラー
  - 確認: `MapId` / `FeatureCollection` / null ガード

---

## 20. 拡張と保守

- 新機能追加ワークフロー:
  1. 既存 feature 配下に配置
  2. 既存 Context/hook で再利用可能か確認
  3. lint と起動確認
  4. 必要に応じ本ドキュメント更新
- リファクタ基準:
  - 見た目変更より先に責務分離と型安全を優先
  - 既存公開 API を壊さない
- 依存更新方針:
  - Expo SDK と react-native の互換セットを維持
- ドキュメント更新ルール:
  - `docs/requirements` と本ファイルの二重管理を避けるため、実装上の真実は本ファイル側を優先して同期する

---

## AI 作業時の必須ルール（このリポジトリ向け）

1. 既存実装がある場合は同じレイヤー/同じ命名規則で実装する。
2. `src/data/geojson/geojsonAssetMap.ts` は生成ファイルのため手編集しない。
3. データ取得は `src/infra/network` のラッパー経由を優先する。
4. 例外型は `src/domain` の既存クラスを利用する。
5. Context を追加する場合は `useXxx()` で Provider ガードを必ず実装する。
6. ロジック改変を伴う大規模変更時は、先に最小差分で安全な実装案を作る。

---

## 更新履歴

- 2026-04-22: 初版作成（リポジトリ構造・技術スタック・運用ルールを明文化）
