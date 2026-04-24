---
applyTo: "app/**,src/features/home/map/**,src/data/geojson/**,src/infra/**"
---

# アーキテクチャ / レイヤ責務

## レイヤ原則

- `app`: composition root。
- `features`: 画面/操作ロジック。`data`/`infra` を直接呼ぶ場合は責務境界を明確にする。
- `data`: 差分更新・manifest・更新オーケストレーション。
- `infra`: 技術詳細（network/filesystem/hash/json/registry）。
- `domain`: 業務例外定義（下位依存なし）。

## 既存設計の尊重

- `MapRoot`（Context提供）+ `MapScreen`（描画責務）分離を壊さない。
- BottomTab は `TabController`（Container）/`TabBar`（Presentational）分離を維持する。

## 変更時の注意

- 既存 public API を不必要に変更しない。
- 依存方向（features → data/infra、data → infra/domain）を逆転させない。
