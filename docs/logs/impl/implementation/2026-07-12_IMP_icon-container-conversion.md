---
agent: IMP
task_id: TASK-icon-container-001
date: 2026-07-12
status: draft
category: log
destination: docs/logs/impl/implementation/
tags:
  - IMP
  - implementation
  - icon-container
---

# Implementation Log — Icon Container Conversion

## Task
TASK-icon-container-001: アイコン表示を画像直置きから円形コンテナ＋アイコン＋テキストのレイアウトに修正

## Changes Made

### 1. New File: `mobile/src/shared/constants/iconStyles.ts`
- Created `ICON_CONTAINER` constant object with:
  - `SEARCHBAR_SIZE`: 28px（検索バー高さ 50px に合わせる）
  - `DEFAULT_SIZE`: 40px（search.tsx 向け）
  - `BACKGROUND_COLOR`: `#F2F2F2`
  - `ICON_SIZE_RATIO`: `"76%"`（コンテナに対するアイコンサイズ比）
  - `BORDER_RADIUS`: 100（完全な円形）

### 2. Modified: `mobile/src/features/home/map/components/controls/searchBar.tsx`
- Import 追加: `ICON_CONTAINER` from `@/src/shared/constants/iconStyles`
- スタイル `iconWrapping` → `iconContainer` にリネーム:
  - width/height: 28 (ICON_CONTAINER.SEARCHBAR_SIZE)
  - backgroundColor: `#F2F2F2` (ICON_CONTAINER.BACKGROUND_COLOR)
  - borderRadius: 100 (ICON_CONTAINER.BORDER_RADIUS)
  - justifyContent: "center", alignItems: "center"
  - marginLeft: 8 は維持
- スタイル `appLogo` → `iconImage` にリネーム:
  - width/height: "76%" (ICON_CONTAINER.ICON_SIZE_RATIO)
- JSX 上の参照を更新（非フォーカス時の View / Image、フォーカス時の TouchableOpacity / Image）
- `hitSlop` は維持（タップ領域確保）

### 3. search.tsx は変更なし（既に目標パターンを満たしているため）

## Files Affected
- `mobile/src/shared/constants/iconStyles.ts` — 新規作成
- `mobile/src/features/home/map/components/controls/searchBar.tsx` — 修正

## Verification
- コンパイルエラーなし
- lint エラーなし

---

## 追記: 2026-07-12 — アイコンサイズ最適化・背景形状変更

### 1. shareComp.tsx — ラベル共通アイコンサイズ・回転
- `iconSize: 0.35` → `iconSize: iconSizeExpression([[17, 0.23], [20, 0.35]])`
  - zoom17→20 の指数補間 (1.5倍カーブ)
- `iconRotationAlignment: "viewport"` → `"map"`（地図回転追従）

### 2. UnitSymbol.tsx — 特殊シンボルアイコンサイズ
- `iconSize: 0.38` → `iconSize: iconSizeExpression([[17, 0.25], [20, 0.38]])`
  - zoom17→20 の指数補間 (1.5倍カーブ)

### 3. convert-special-symbols.ts — 四角背景→円背景
- `rect (112×112, rx=12)` → `circle (cx=56, cy=56, r=48)`
- スクリプト実行完了: 7/7 PNG 再生成成功

### 4. MapSymbolIcon.tsx — 確認のみ（変更不要）
- `iconRotationAlignment: "map"` 既に設定済み

### 計算根拠
- zoom20 理想値: 通常 0.35 / 特殊 0.38
- zoom17 = zoom20 / 1.5
- 通常: 0.35/1.5 ≈ 0.233 → 0.23
- 特殊: 0.38/1.5 ≈ 0.253 → 0.25

### 確認
- TypeScript コンパイルエラー: なし（4ファイルとも）
- PNG 再生成: 7/7 成功
- TypeScript の型安全を維持

## Handoff to REV
本実装のコードレビューを依頼する。
