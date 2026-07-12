---
agent: IMP
task_id: TASK-imp-003
date: 2026-07-12
status: draft
category: log
destination: logs/impl/implementation/2026-07-12_IMP_icon-rotation-text-alignment.md
related:
  - "[shareComp renderer](../mobile/src/features/home/map/renderers/labels/shareComp.tsx)"
  - "[UnitSymbol renderer](../mobile/src/features/home/map/renderers/UnitSymbol.tsx)"
  - "[MapSymbolIcon renderer](../mobile/src/features/home/map/renderers/symbols/MapSymbolIcon.tsx)"
tags:
  - IMP
  - bugfix
  - maplibre
  - icon-rotation
---

# アイコン回転が効かない問題の修正

## 問題

MapLibre SymbolLayer において `iconRotationAlignment: "map"` のみが設定され、`textRotationAlignment` が未設定（デフォルト `"auto"`）だったため、アイコンとテキストの回転アライメントにミスマッチが発生。画面上では文字のみ回転しアイコンが回転しない状態だった。

## 修正内容

3ファイルの SymbolLayer スタイル設定に `textRotationAlignment: "map"` を追加。

| # | ファイル | 変更箇所 |
|---|---------|----------|
| 1 | `shareComp.tsx` | `iconRotationAlignment: "map"` の直後に `textRotationAlignment: "map"` を追加 |
| 2 | `UnitSymbol.tsx` | 同上 |
| 3 | `MapSymbolIcon.tsx` | 同上 |

## 確認結果

- TypeScript コンパイルエラーなし（全3ファイル）
- 構文は既存の `Paint`/`LayerStyle` オブジェクトに準拠
