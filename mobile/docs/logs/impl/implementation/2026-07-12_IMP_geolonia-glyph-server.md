---
agent: IMP
task_id: TASK-000
date: 2026-07-12
status: draft
category: log
destination: logs/impl/implementation/
tags:
  - IMP
  - glyph-server
  - map-style
---

# Implementation Log: Switch to geolonia Glyphs Server for CJK Japanese Support

## Summary

orangemug.github.io/font-glyphs の Noto Sans は CJK グリフがスタブ（13 bytes の空データ）だったため、glyphs.geolonia.com に切り替えた。geolonia は Noto Sans CJK JP を提供し、Latin と日本語グリフの両方をカバーする。

## Changes

### File 1: `src/shared/constants/typography.ts`

- JSDoc `### 2.` を更新: orangemug → geolonia
- `FONT_STACK` のフォント名を変更:
  - `["Noto Sans Regular"]` → `["Noto Sans CJK JP Regular"]`
  - `["Noto Sans Bold"]` → `["Noto Sans CJK JP Bold"]`
- `MEDIUM` も `["Noto Sans CJK JP Bold"]` に変更（Medium 相当）
- 注意書きを追加: geolonia はスタティックホスティングのためフォント配列は必ず単一要素にすること

### File 2: `src/features/home/map/constants/mapStyle.ts`

- `glyphs` URL を変更:
  - `https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf`
  - → `https://glyphs.geolonia.com/{fontstack}/{range}.pbf`
- JSDoc コメントを更新

## Verification

- TypeScript errors: 0 (both files clean)
- `FONT_STACK` のエクスポート構造は不変のため、`shareComp.tsx` など既存のインポート元に影響なし
