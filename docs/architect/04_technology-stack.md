# 04. 技術スタック

## 1. フロントエンド

**React Native Expo + TypeScript**

役割：UI・状態管理・地図操作・画面遷移。Android・iOS・Web の共通コード化を実現。

## 2. 地図描画

**MapLibre React Native**

採用理由：
- 高いカスタマイズ性
- ベクトルデータ（GeoJSON）との親和性
- クロスプラットフォーム対応
- オフライン利用可能

## 3. ネイティブ測位エンジン

**Kotlin**

役割：センサー取得・PDR・Wi-Fi・地磁気・位置推定。React Native 側へ結果のみ通知。Android 固有機能をすべて閉じ込める。

## 4. 地図データ形式

**GeoJSON**

採用理由：
- MapLibre との高い互換性
- 人が編集しやすい
- QGIS との連携が容易
- Git 管理しやすい

## 5. 開発言語

- **TypeScript**: React Native / 共有ライブラリ
- **Kotlin**: Android Position Engine

## 6. CI/CD

**GitHub Actions**。Map Assets Pipeline（変換→検証→Release 生成）の自動化、およびアプリビルド。

## 7. 配布

**Cloudflare R2**。Map Assets を独立した成果物として配布。アプリ更新なしでデータ更新可能。

## 8. エディタ

**QGIS**。地図データの作成・編集に使用。Map Assets Pipeline の入力として利用。

## 9. ビルドシステム

- **Gradle**: Kotlin（Android Position Engine）。Node.js とは完全分離。
- **Metro / React Native Expo CLI**: React Native アプリ。
