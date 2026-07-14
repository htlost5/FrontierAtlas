---
agent: IMP
task_id: floor-switch-perf
date: 2026-07-11
status: pending
category: log
destination: logs/impl/implementation/2026-07-11_IMP_floor-switch-perf.md
related:
  - DD-01: ShapeSource グループ化統合
  - DD-02: 透過レイヤーの生成スキップ
  - DD-03: React.memo 化
  - DD-04: MapIconRegistry の MapContainer レベルへの移動
  - DD-05: display_point GeoJSON 加工の useMemo 化
  - DD-06: UnitSymbol の ShapeSource 重複修正
tags:
  - IMP
  - perf-optimization
  - floor-switch
---

# 実装ログ: フロア切替パフォーマンス最適化

## 変更サマリ

全6件の設計決定（DD）を実装。7ファイルを変更し、すべての TypeScript コンパイルエラーを解消済み。

## 変更ファイル一覧

### 1. `filter.ts` - ROOM_CATEGORIES のエクスポート

- `const ROOM_CATEGORIES` → `export const ROOM_CATEGORIES`
- `configs.ts` からグループフィルタ生成のために参照する必要があったため

### 2. `configs.ts` - スタイルグループ定義の追加（DD-01 / DD-02）

- **追加したエクスポート**:
  - `RoomStyleGroup` 型（"default" | "courtyard" | "terrace" | "transparent"）
  - `getRoomStyleGroup(key)` - RoomKey → グループマッピング関数
  - `ROOM_STYLE_GROUPS` - グループごとの RoomKey 配列
  - `buildGroupFilter(group)` - `["in", ["get", "category"], ["literal", [...]]]` 式生成
  - `GROUP_FILTERS` - グループごとのフィルタ式
  - `GROUP_STYLE_CONFIGS` - グループごとのスタイル定義（transparent 除外）
- 既存の `ROOM_CONFIGS` は互換性維持のため残存
- 散在していた import 文をファイル先頭に集約

### 3. `rooms/index.tsx` - RoomView のグループ化統合（DD-01 / DD-02）

- **Before**: 45個の `PolygonLayer` を個別生成（45回 ShapeSource が作られていた）
- **After**: 3個のグループ（default, courtyard, terrace）のみ `PolygonLayer` を生成
- transparent グループはスキップ（DD-02 自動達成）

### 4. `venue/index.tsx` - React.memo 化（DD-03）

- `VenueView` を `React.memo` でラップ

### 5. `buildings/index.tsx` - React.memo 化（DD-03）

- `BuildingsView` を `React.memo` でラップ
- `import React from "react"` を追加
- 閉じ括弧を `});` に修正

### 6. `MapIconLabel.tsx` - MapIconRegistry 削除 + useMemo 化（DD-04 / DD-05）

- `<MapIconRegistry />` の呼び出しを削除（DD-04）
- `import { MapIconRegistry }` を削除
- `processedFeatures` の計算（filter + map）を `useMemo` でラップ（DD-05）
  - 依存配列: `[data]`
- Hooks の条件付き呼び出し問題を避けるため、`useMemo` 内で null チェックし早期リターン前に配置

### 7. `MapContainer.tsx` - MapIconRegistry の追加（DD-04）

- `<MapIconRegistry />` を `<MapView>` 直下に追加
- `import { MapIconRegistry }` を追加
- コメントで変更意図を明記

### 8. `toilet.tsx` - ShapeSource 重複修正（DD-06）

- **Before**: 3個の `MapSymbolIcon` → 3個の独立した `ShapeSource` が生成されていた
- **After**: 単一の `ShapeSource` + 3個の `SymbolLayer` に集約
- アイコン画像は `Images` にまとめて登録
- `MapSymbolIcon` の使用を廃止し、直接 `ShapeSource` + `SymbolLayer` を利用
- ※ Elevator / Vending は単一の MapSymbolIcon しか使用していないため変更不要

## 自己チェック結果

- [x] 各ファイルのインポートが正しいこと
- [x] 既存の型定義と互換性があること
- [x] 変更箇所以外に影響がないこと
- [x] TypeScript コンパイルエラーが存在しないこと（全7ファイル確認済み）

## 期待される効果

| DD   | 効果                                              |
|------|--------------------------------------------------|
| DD-01 | PolygonLayer 45→3、ShapeSource 45→3              |
| DD-02 | 透過レイヤー（lounge/lobby/informationLounge）の描画スキップ |
| DD-03 | VenueView / BuildingsView の不要再レンダリング防止     |
| DD-04 | MapIconRegistry を1回のみ実行（フロア切替時に再実行不要） |
| DD-05 | display_point 加工のメモ化                       |
| DD-06 | トイレ ShapeSource 3→1                          |
