---
agent: IMP
task_id: icon-container-conversion
date: 2026-07-12
status: draft
category: log
destination: logs/impl/implementation/
tags:
  - IMP
  - icon-resize
  - png-generation
---

# Implementation Log: アイコン円内最大化

## 概要
円に内接する正方形の対角線 = 円直径の原理に基づき、
背景円に対してアイコンサイズを最大化。

## 計算
- 通常カテゴリ（circle r=40, d=80）: 80/√2 ≈ 56.6 → **56px**
- 特殊シンボル（circle r=48, d=96）: 96/√2 ≈ 67.9 → **72px**

## 修正ファイル
| ファイル | 変更内容 | 結果 |
|----------|----------|------|
| `tools/map-assets/scripts/convert-tabler-icons.ts` | `resize(48,48)` → `resize(56,56)` | ✅ 14枚生成 |
| `tools/map-assets/scripts/convert-special-symbols.ts` | `resize(64,64)` → `resize(72,72)` | ✅ 7枚生成 |

## 品質チェック
- [x] 両スクリプト正常終了
- [x] 全21枚のPNGが出力されている
- [x] 各出力ファイルのコンテナサイズに変更なし（96×96 / 112×112）
- [x] アイコンサイズのみ適正値に変更
