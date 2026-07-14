---
agent: REV
task_id: TASK-compass-001
date: 2026-07-14
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[mapConfig.ts](../../../src/features/home/map/constants/mapConfig.ts)"
  - "[boundsBound.ts](../../../src/features/home/map/hooks/camera/useCameraController/boundsBound.ts)"
tags:
  - REV
  - review
  - breakpoints-inset
---

# Review Log: breakpoints inset 方式への変更

## Review Result

**判定: ✅ 承認（条件付き）**

CRITICAL 指摘なし。TypeScript エラーなし。変換ロジックは正しい。
軽微な改善提案（2件）を付記。

---

## 変更サマリ

| ファイル | 変更内容 |
|----------|----------|
| `mapConfig.ts` | `breakpoints` の型を `{ zoom, ne, sw }` → `{ zoom, inset }` に変更 |
| `boundsBound.ts` | `insetToBounds()` 関数を追加。inset（メートル）から動的に ne/sw を計算 |

---

## レビュー詳細

### 1. 型の正しさ ✅

- `breakpoints: [{ zoom: 17.3, inset: 0 }, { zoom: 20.8, inset: 80 }]` — 型推論で `{ zoom: number; inset: number }[]`、エラーなし
- `insetToBounds(inset: number): { ne: [number, number]; sw: [number, number] }` — 入出力の型整合、問題なし
- `get_errors` 確認済み: エラーゼロ

### 2. 計算の正しさ ✅

**inset: 0 → 元の bounds と完全一致**
- `insetDegLat = 0 / 111320 = 0`
- `insetDegLng = 0 / (111320 * cos(lat)) = 0`
- ne/sw とも元の `mapConfig.restrict.bounds` と同一 ✅

**経度変換の緯度補正**
- `centerLat ≈ 35.4977°` → `cos(35.4977°) ≈ 0.814`
- `metersPerDegLng ≈ 90,660`（赤道 111,320 の 81.4%）
- 地理的事実と一致 ✅

**方向性**
- NE から減算（南西方向へ縮小）✅
- SW に加算（北東方向へ縮小）✅

### 3. 補間の等価性 ✅

`insetToBounds` は線形関数 → `lerp(insetToBounds(a), insetToBounds(b), t)` と `insetToBounds(lerp(a, b, t))` は数学的に等価。現在の実装で正しい。

### 4. コード品質 ✅

- `insetToBounds()` は純粋関数として分離されテスト容易
- ロジックの流れ: breakpoints探索 → inset補間 → 座標補間 → クランプ、明確で追いやすい
- エッジケース: `breakpoints.length < 2` 早期 return、`hi.zoom === lo.zoom` で `t=0` もハンドリング済み

---

## 軽微な改善提案

| # | 指摘 | 重要度 | 詳細 |
|---|------|--------|------|
| 1 | inset が bounds サイズを超過すると bounds が破綻 | Low | inset=80m の場合、経度方向の必要縮小幅 2×0.000882°=0.001764° に対し元の幅は 0.001759° で超過。実運用で inset 値が適切であることを確認推奨。ガード節追加も可 |
| 2 | `centerLat` の再計算 | Low | `insetToBounds()` 呼び出しごとに再計算されるが bounds は固定値のため結果は一定。トップレベル定数化してもよい（必須ではない） |

---

## 品質ゲート

- [x] コードレビュー完了
- [x] セキュリティチェック完了（該当なし・入力検証・権限問題なし）
- [x] 仕様準拠検証完了
- [x] TypeScript エラー 0件（`get_errors` 確認済み）
- [x] CRITICAL 指摘なし

---

## HANDOFF

```
status: 承認（条件付き）
confidence: high
artifacts:
  - src/features/home/map/constants/mapConfig.ts
  - src/features/home/map/hooks/camera/useCameraController/boundsBound.ts
open_questions: なし
routing: TST
next_actions: テスト実行。inset=0 と inset=80 の両端および中間ズームでの境界クランプ動作を確認。
```
