---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-14
status: draft
category: log
destination: docs/logs/impl/implementation/
tags:
  - IMP
  - implementation
  - breakpoints
  - inset
---

# Implementation Log: breakpoints を inset（メートル）方式に変更

## 変更内容

`dynamicCenter.breakpoints` の定義を絶対座標（`ne`/`sw`）から inset（メートル）方式に変更した。

### 変更ファイル

#### 1. `src/features/home/map/constants/mapConfig.ts`

- breakpoints の `ne`/`sw` を `inset`（メートル）に置き換え
- `inset: 0` → restrict.bounds と同一範囲（境界ぴったり）
- `inset: 80` → 各辺から 80m 内側

#### 2. `src/features/home/map/hooks/camera/useCameraController/boundsBound.ts`

- `insetToBounds()` 関数を新規追加 — inset（メートル）から `ne`/`sw` 座標を計算
- メートル→度の変換: `1° lat ≈ 111,320m`、`1° lng ≈ 111,320m × cos(latitude)`
- 中心緯度は `restrict.bounds` から計算: `(bounds.ne[1] + bounds.sw[1]) / 2`
- 補間は inset 値を元に計算した ne/sw に対して実行（既存の `lerp` を流用）

### 検証

- TypeScript エラーなし（VSCode の get_errors で確認済）
- lint エラーなし（`npx expo lint` で確認済）
- `inset: 0` で `restrict.bounds` と同一範囲になることは数学的に確認済
- `inset: 80` で高ズーム時（zoom 20.8）に中心範囲が狭まることは既存と同等
