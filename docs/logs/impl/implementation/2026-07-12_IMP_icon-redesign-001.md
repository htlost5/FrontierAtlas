---
agent: IMP
task_id: TASK-icon-redesign-001
date: 2026-07-12
status: draft
category: log
destination: logs/impl/implementation/
related:
  - "[colorPalette.ts](../../../../mobile/src/features/home/map/constants/colorPalette.ts)"
  - "[expressionHelpers.ts](../../../../mobile/src/features/home/map/renderers/expressions/expressionHelpers.ts)"
  - "[convert-tabler-icons.ts](../../../../tools/map-assets/scripts/convert-tabler-icons.ts)"
  - "[convert-special-symbols.ts](../../../../tools/map-assets/scripts/convert-special-symbols.ts)"
  - "[MapIconRegistry.tsx](../../../../mobile/src/features/home/map/renderers/MapIconRegistry.tsx)"
  - "[shareComp.tsx](../../../../mobile/src/features/home/map/renderers/labels/shareComp.tsx)"
  - "[MapSymbolIcon.tsx](../../../../mobile/src/features/home/map/renderers/symbols/MapSymbolIcon.tsx)"
  - "[UnitSymbol.tsx](../../../../mobile/src/features/home/map/renderers/UnitSymbol.tsx)"
tags:
  - IMP
  - icon-redesign
  - implementation
---

# Implementation Log: マップシンボルアイコン デザインリニューアル

## タスク概要
通常地物シンボルを「背景色より濃い色の丸＋白色シンボル」に変更。特殊シンボル（restroom/elevator/vending/locker/emergency_exit）を「濃いグレーの角丸四角＋白色シンボル（1.2倍サイズ）」に変更。ズーム補間を exponential 1.5 に統一。

## 実装内容

### Step 1: colorPalette.ts — circleFill フィールド追加
- `RoomCategoryPalette` に `circleFill?: string` を追加
- `LIGHT_THEME.rooms` 全8カテゴリに濃い色の circleFill を設定
- `DARK_THEME.rooms` 全8カテゴリに line色を circleFill として設定

### Step 2: expressionHelpers.ts — iconSizeExpression() 追加
- `iconSizeExpression()` 関数を新規追加
- 指数補間 `["exponential", 1.5]` を使用
- 2点以上のストップを必須とするバリデーション付き

### Step 3: convert-tabler-icons.ts 改修
- 背景形状: 角丸四角 → 円 (`<circle cx="48" cy="48" r="40"/>`)
- アイコン色: テーマ依存 → 白固定 (`#FFFFFF`)
- アイコンサイズ: 56×56 → 48×48
- 塗り色: `LIGHT_ROOM_FILLS`/`DARK_ROOM_FILLS` → `LIGHT_CIRCLE_FILLS`/`DARK_CIRCLE_FILLS`
- circulation (#66BB6A) の色定義を追加
- スクリプト実行: 14ファイル生成完了 ✅

### Step 4: convert-special-symbols.ts 新規作成
- 112×112px キャンバス、角丸四角 rx=12, fill=#444444
- アイコン 64×64px, 白色 #FFFFFF
- 7種の特殊シンボル生成テーブル:
  - `special-toilet-male`: gender-male
  - `special-toilet-female`: gender-female
  - `special-toilet-accessible`: wheelchair
  - `special-elevator`: elevator
  - `special-vending`: shopping-bag
  - `special-locker`: lock
  - `special-emergency-exit`: door-exit
- スクリプト実行: 7ファイル生成完了 ✅

### Step 5: MapIconRegistry.tsx — 特殊シンボル追加
- 7つの特殊シンボルPNG import 追加
- `ICON_IMAGES` に7エントリ追加

### Step 6: shareComp.tsx — iconSizeExpression 適用
- `iconSizeExpression` import 追加
- `iconSize` を `iconSizeExpression([[17, 0.35], [19, 0.45], [21, 0.55]])` に変更

### Step 7: MapSymbolIcon.tsx — iconSizeExpression 適用
- `iconSizeExpression` import 追加
- `iconSize` を `iconSizeExpression([[17.9, iconSizeBase * 0.5], [21.1, iconSizeBase * 3.7]])` に変更

### Step 8: UnitSymbol.tsx — 全面再設計
- 単一 ShapeSource + 7個の SymbolLayer で全特殊シンボルを統合
- 各SymbolLayerは category フィルターで条件分岐
- iconSize: `iconSizeExpression([[17.9, 0.42], [21.1, 0.66]])`（通常の1.2倍）

### Step 9: toilet.tsx / elevator.tsx 削除
- `symbols/toilet.tsx` 削除
- `symbols/elevator.tsx` 削除

### Step 10: 旧PNG削除
- `MapLogo/toilet/male.png` 削除
- `MapLogo/toilet/female.png` 削除
- `MapLogo/toilet/wheelchair.png` 削除
- `MapLogo/elevator/elevator.png` 削除

## 自己チェック
- [x] TypeScript コンパイル: `npx tsc --noEmit` — エラー0件
- [x] 旧ファイル参照残存: toilet.tsx/elevator.tsx/旧PNGパス — 0件
- [x] 14枚の通常アイコンPNG生成完了
- [x] 7枚の特殊シンボルPNG生成完了
- [x] 削除ファイルへのimport残存なし

## 補足
- `toilet.svg` / `vending-machine.svg` はTabler Iconsに存在しないため、代替として `gender-male.svg` / `gender-female.svg` / `shopping-bag.svg` を使用
- 特殊シンボルのサイズ: 112×112px（通常96×96の約1.17倍 ≈ ARC指定の1.2倍）
- iconSize: 通常0.35〜0.55 に対し特殊0.42〜0.66（約1.2倍）
