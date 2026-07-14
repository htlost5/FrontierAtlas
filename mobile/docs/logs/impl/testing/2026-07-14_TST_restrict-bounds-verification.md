---
agent: TST
task_id: TASK-compass-001
date: 2026-07-14
status: approved
category: log
destination: docs/logs/impl/testing/
related:
  - "[TASK-compass-001](../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - TST
  - test
  - TASK-compass-001
---

# Test Log: mapConfig restrict.bounds 値検証

## 検証対象
`src/features/home/map/constants/mapConfig.ts`

## テスト結果

**判定: ✅ 合格**

### 1. 値の確認 ✅

| フィールド | 期待値 | 実際の値 | 結果 |
|---|---|---|---|
| `restrict.bounds.ne` | `[139.679714, 35.499915]` | `[139.679714, 35.499915]` | ✅ |
| `restrict.bounds.sw` | `[139.677075, 35.495558]` | `[139.677075, 35.495558]` | ✅ |

### 2. 整合性チェック ✅

| チェック項目 | 計算 | 結果 |
|---|---|---|
| NE 経度 > SW 経度 | 139.679714 > 139.677075 | ✅ (2.639deg差) |
| NE 緯度 > SW 緯度 | 35.499915 > 35.495558 | ✅ (0.004357deg差) |

→ bounds が正しい矩形（NE > SW）を形成していることを確認。

### 3. 型エラーチェック ✅

`get_errors` ツールで確認: **No errors found**

### 4. ファイル全体スナップショット ✅

restrict セクション以外に意図しない変更はなし。ファイルは以下のセクションで構成:

- `zoom` — ズーム制限 (max:20.8, min:17.3, buffer:0.1)
- `default` — 初期位置設定
- `zoom` — softMax/softMin 導出値
- `restrict` — bounds + dynamicCenter (本タスク対象)
- `displayThresholds` — 表示閾値
- `animation` — アニメーション設定

## 総評

全4項目をクリア。`restrict.bounds` は指定された値に正しく設定されており、整合性・型・ファイル全体の一貫性に問題なし。
