---
applyTo: "**"
---

# 品質ゲート / 検証

## 最低実施

- 変更後に `npm run lint` を実行する。
- エラーがあれば修正してから完了する。

## テスト導入時の優先順位（指針）

1. `src/data/geojson/tasks/*` の差分判定ロジック
2. `loadAllGeoJson` の fallback 分岐
3. `MapRoot` / `TabController` の最小描画

## 変更レビュー観点

- 依存方向の破壊がないか
- 例外/検証/フォールバックが維持されているか
- 既存の API/命名規約と一貫しているか
