---
agent: IMP
task_id: TASK-sortKey-fix
date: 2026-07-12
status: pending
category: shared
destination: shared/impl/logs/implementation/
tags:
  - IMP
  - sortKey
  - mapLibre
---

# Implementation Log: sortKey 値反転修正

## 修正内容
`UnitSymbol.tsx` の `SPECIAL_SYMBOLS` 配列内の `sortKey` 値を、MapLibre 正仕様に合わせて反転。

### MapLibre 仕様
- `iconAllowOverlap: false` のとき、**sortKey が小さいほど優先的に配置（表示）される**

### 修正前 → 修正後

| カテゴリ | 修正前 sortKey | 修正後 sortKey |
|---|---|---|
| restroom_male | 3 | 1 |
| restroom_female | 3 | 1 |
| restroom_accessible | 3 | 1 |
| elevator | 2 | 2 |
| vending_machine | 1 | 3 |
| locker | 1 | 3 |
| emergency_exit | 1 | 3 |

### コメント修正
- 旧: `// sortKey: 値が大きいほど重なり時に優先表示 (symbolSortKey 仕様)`
- 新: `// sortKey: iconAllowOverlap=false 時は値が小さいほど優先表示`

### 影響範囲
- `UnitSymbol.tsx` のみ。コンパイルエラーなし。
