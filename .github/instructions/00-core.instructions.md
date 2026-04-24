---
applyTo: "**"
---

# FrontierAtlas 共通運用ルール（全体適用）

## 優先順位

1. 実際のコード
2. このルール群
3. 一般ベストプラクティス

## MUST

- 変更前に `app/` → `src/features/home/map` → `src/data/geojson` → `src/infra` の順で確認する。
- 生成ファイル `src/data/geojson/geojsonAssetMap.ts` は手編集しない。
- 既存の Context ガード（`if (!ctx) throw`）と `src/domain` のエラー型を再利用する。
- 変更後は最低 `npm run lint` を実行し、失敗を解消してから完了する。

## MUST NOT

- UI 層で直接ファイル I/O やネットワーク処理をしない。
- size/hash 検証なしで remote データを反映しない。

## 回答/実装スタイル

- 実装方針は「結論→根拠→影響範囲」で簡潔に記述する。
- 一般的なスタイル規約の長文重複は避ける（lint/型検査へ委譲）。
