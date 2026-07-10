---
agent: IMP
task_id: TASK-fix-rooms-type-error
date: 2026-07-11
status: draft
category: log
destination: logs/impl/implementation/2026-07-11_IMP_fix-rooms-type-error.md
related:
  - "[rooms/index.tsx](../../mobile/src/features/home/map/layers/floor/unit/rooms/index.tsx)"
tags:
  - IMP
  - type-fix
  - rooms
---

# 実装ログ: rooms/index.tsx の型エラー修正

## 修正内容

**ファイル**: `src/features/home/map/layers/floor/unit/rooms/index.tsx`

**エラー**: TS7053 — `Object.keys(GROUP_STYLE_CONFIGS) as RoomStyleGroup[]` により、
`RoomStyleGroup` 型に `"transparent"` が含まれる可能性があると TypeScript が判断し、
`GROUP_STYLE_CONFIGS[group]` のインデックスアクセスでエラーが発生。

**修正**: キャスト型を `RoomStyleGroup[]` から `(keyof typeof GROUP_STYLE_CONFIGS)[]` に変更。
これにより `GROUP_STYLE_CONFIGS` の実際のキー（`"courtyard" | "terrace" | "default"`）のみが
型として認識されるようになり、`"transparent"` が含まれなくなる。

```typescript
// Before
const VISIBLE_GROUPS = Object.keys(GROUP_STYLE_CONFIGS) as RoomStyleGroup[];

// After
const VISIBLE_GROUPS = Object.keys(GROUP_STYLE_CONFIGS) as (keyof typeof GROUP_STYLE_CONFIGS)[];
```

## 検証結果

- `npx tsc --noEmit` 通過（型エラー 0）
- 不要な import（`RoomStyleGroup`）は他の箇所で使用されているため削除不要
