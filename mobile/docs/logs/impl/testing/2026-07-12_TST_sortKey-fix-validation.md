---
agent: TST
task_id: TASK-fix-sortKey-inversion
date: 2026-07-12
status: approved
category: log
destination: logs/impl/testing/
tags:
  - TST
  - testing
  - sortKey
---

# Testing Log: sortKey 値修正の検証

## テスト対象
- `d:\htlost5-workspace\projects\frontieratlas\mobile\src\features\home\map\renderers\UnitSymbol.tsx`

## テスト観点と結果

### 1. TypeScript コンパイルチェック ✅
- コマンド: `npx tsc --noEmit --pretty`
- 結果: **エラーなし**（出力なし = 正常）

### 2. `symbolSortKey` が `SymbolLayerStyle` 型に存在するか ✅
- `@maplibre/maplibre-react-native` の型定義を確認:
  - `src/types/MapLibreRNStyles.ts:346`: `symbolSortKey?: Value<number, ["zoom", "feature"]>`
  - Android: `MLRNStyleFactory.java` で `case "symbolSortKey"` がハンドリング済み
  - iOS: `MLRNStyle.m` で `symbolSortKey` がハンドリング済み
- **型定義済みであり、有効なプロパティであることを確認**

### 3. sortKey 値が仕様通りか ✅
| シンボル | category | sortKey | 優先度 |
|----------|----------|---------|--------|
| トイレ(男性) | restroom_male | 1 | 最高 |
| トイレ(女性) | restroom_female | 1 | 最高 |
| トイレ(多目的) | restroom_accessible | 1 | 最高 |
| エレベータ | elevator | 2 | 中 |
| 自販機 | vending_machine | 3 | 最低 |
| ロッカー | locker | 3 | 最低 |
| 非常口 | emergency_exit | 3 | 最低 |

### 4. `iconAllowOverlap: false` と `symbolSortKey` の論理的整合性 ✅
- MapLibre 仕様: `symbolSortKey` は値が**小さいほど優先表示**（`iconAllowOverlap: false` 時）
- トイレ系=1（最高優先）→ エレベータ=2（中）→ その他=3（最低優先）
- コメントにも正しい説明あり: `// sortKey: iconAllowOverlap=false 時は値が小さいほど優先表示`
- **論理的に正しい**

## 総合判定: ✅ 合格

全テスト観点を通過。問題なし。
