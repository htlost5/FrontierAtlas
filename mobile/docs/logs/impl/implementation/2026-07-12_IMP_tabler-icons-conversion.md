---
agent: IMP
task_id: TASK-symbol-unification
date: 2026-07-12
status: draft
category: log
destination: logs/impl/implementation/
tags:
  - IMP
  - tabler-icons
  - map-symbol
  - png-conversion
---

# Implementation Log: Tabler Icons PNG 生成 + MapIconRegistry 差し替え

## Summary

シンボル統一タスクの残り2件を完了:

1. `convert-tabler-icons.ts` を `sharp-cli` 依存から `sharp` 直接利用に修正
2. 8個のカテゴリアイコン PNG を生成
3. `MapIconRegistry.tsx` の import を仮ユニットアイコンから本番カテゴリアイコンに差し替え

## Changes

### tools/map-assets/scripts/convert-tabler-icons.ts

- `sharp-cli`（execSync）から `sharp` ライブラリ直接利用に書き換え
- SVG 一時ファイル出力を削除し、`sharp(Buffer.from(svgContent))` で直接変換
- `@tabler/icons` v3 のパス構造対応: `icons/outline/` サブディレクトリ参照
- monorepo hoist 対策: `../../../node_modules` でルート node_modules を参照

### mobile/src/assets/images/icons/MapView/map/categoryIcons/*.png

生成された8ファイル:

| ファイル | 元SVG | サイズ |
|---|---|---|
| learning.png | book.svg | 96x96 |
| laboratory.png | flask.svg | 96x96 |
| creative.png | palette.svg | 96x96 |
| meeting.png | presentation.svg | 96x96 |
| staff.png | building-bank.svg | 96x96 |
| social.png | coffee.svg | 96x96 |
| sanitary.png | droplet.svg | 96x96 |
| circulation.png | arrows-move.svg | 96x96 |

### mobile/src/features/home/map/renderers/MapIconRegistry.tsx

- 8つの import を `unitIcons/*.png` → `categoryIcons/*.png` に差し替え
- コメント更新: 仮流用に関する NOTE を削除、Tabler Icons 変換アイコンである旨を明記

## Verification

- TypeScript コンパイル: `npx tsc --noEmit` → エラー0件
- 8個の PNG が正しく出力されていることを確認

## Dependencies

- `@tabler/icons` v3.44.0 （hoist 先: root node_modules）
- `sharp` v0.35.3 （hoist 先: root node_modules）
- `tsx` （スクリプト実行用、npx 経由）
