---
agent: IMP
task_id: TASK-icon-container-002
date: 2026-07-12
status: draft
category: log
destination: docs/logs/impl/implementation/2026-07-12_IMP_icon-container-conversion.md
tags:
  - IMP
  - icon-container
  - map-symbol
  - tabler-icons
  - composite-png
---

# Implementation Log: 角丸四角コンテナ＋テーマ別アイコン変換

## Summary

ARC からのハンドオフに基づき、マップのシンボルアイコン表示を「角丸四角コンテナ＋小アイコン」に修正。ライト/ダーク両対応。circulationのアイコンを非表示化。

## Changes

### 1. `tools/map-assets/scripts/convert-tabler-icons.ts`
- 単色96x96 PNG生成 → 複合PNG（角丸四角背景96x96 r=8 + 中央56x56アイコン）生成に変更
- 14ファイル生成（7カテゴリ × light/dark テーマ）

### 2. カテゴリアイコンPNG（14ファイル生成、8ファイル削除）
**生成**: `mobile/assets/images/icons/MapView/map/categoryIcons/`
- learning-light.png, learning-dark.png
- laboratory-light.png, laboratory-dark.png
- creative-light.png, creative-dark.png
- meeting-light.png, meeting-dark.png
- staff-light.png, staff-dark.png
- social-light.png, social-dark.png
- sanitary-light.png, sanitary-dark.png

**削除**: 旧8ファイル（learning.png, laboratory.png, creative.png, meeting.png, staff.png, social.png, sanitary.png, circulation.png）

### 3. `mobile/src/features/home/map/renderers/MapIconRegistry.tsx`
- 8個の旧import → 14個の新import（7カテゴリ × light/dark）に置き換え
- ICON_IMAGES をテーマ別キー（`"learning-light"` 形式）に変更
- circulation は登録対象外

### 4. `mobile/src/features/home/map/renderers/labels/LabelConfig.ts`
- `iconKey?: string` フィールドを追加

### 5. `mobile/src/features/home/map/renderers/labels/LabelConfigs.ts`
- `createLabelConfigs` 内で `iconKey: \`${cat}-${themeSuffix}\`` を生成
- `overrides` に `circulation: { iconVisible: false }` を追加

### 6. `mobile/src/features/home/map/renderers/labels/shareComp.tsx`
- `iconImage` の参照を `config.key` → `config.iconKey ?? config.key` に変更

## Verification
- TypeScript コンパイルエラー: なし（`npx tsc --noEmit` 通過）
- 生成PNG: 14ファイル（7カテゴリ × 2テーマ）
- 旧PNG: 8ファイル削除済み
