---
agent: REV
task_id: TASK-compass-001
date: 2026-07-14
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[IMP Log](../logs/impl/implementation/2026-07-14_IMP_bounds-narrowBy.md)"
  - "[mapConfig.ts](../../../../src/features/home/map/constants/mapConfig.ts)"
  - "[boundsBound.ts](../../../../src/features/home/map/hooks/camera/useCameraController/boundsBound.ts)"
tags:
  - REV
  - review
  - TASK-compass-001
  - bounds-narrowBy
---

# Review Log: boundsBreakpoints narrowBy 実装レビュー

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。コードは REQ-compass-002 の全受入条件を満たしている。
1件の軽微な推奨事項あり（リリースノート記載）。

--- 

## Review Checklist

### 1. 型の正しさ ✅

| ファイル | チェック | 結果 |
|---|---|---|
| `mapConfig.ts` | `narrowBy: 0` / `narrowBy: 80` — 数値型として正しい。`inset` の残存なし | ✅ |
| `boundsBound.ts` | `narrowByToBounds(narrowBy: number): { ne: [number,number]; sw: [number,number] }` — 入出力型整合 | ✅ |
| `boundsBoundary` | `CameraAction` 型 `(camera: CameraRef, region: CameraRegion) => void` に適合 | ✅ |

TypeScript エラー: **0件** (get_errors で確認済)

### 2. narrowByToBounds のロジック正当性 ✅

**処理フロー:**
```
maxBounds.ne/sw (EPSG:4326)
  → toLocalXY() で LOCAL_XY (メートル) に変換
  → 各辺から narrowBy メートル減算
    - NE: neX - n, neY - n  (南西方向へ移動)
    - SW: swX + n, swY + n  (北東方向へ移動)
  → fromLocalXY() で EPSG:4326 に逆変換
```

**narrowBy=0 の場合:**
- `neX - 0 = neX`, `neY - 0 = neY`
- `swX + 0 = swX`, `swY + 0 = swY`
- → 元の `maxBounds` と完全一致 ✅ (FR-02)

**narrowBy=80 の場合:**
- 各辺から 80m ずつ内側に移動（クランプがかからない範囲で）
- LOCAL_XY 上の直交計算なのでメートル精度が正確 ✅ (FR-02)

### 3. 補間ロジック ✅ (FR-03)

- **旧方式 (inset)**: breakpoints 探索 → narrowBy 値 lerp → `narrowByToBounds()` で座標変換
- **新方式 (narrowBy)**: 同じ（プロパティ名が変わったのみ）
- `narrowByToBounds` は LOCAL_XY 上の線形変換 → `lerp(lo.narrowBy, hi.narrowBy, t)` の補間値に対する変換は数学的に健全 ✅

**補間コード抜粋確認:**
```typescript
const t = hi.zoom !== lo.zoom
  ? Math.max(0, Math.min(1, (z - lo.zoom) / (hi.zoom - lo.zoom)))
  : 0;
narrowBy = lerp(lo.narrowBy, hi.narrowBy, t);
```
- t の clamp (0〜1) あり ✅
- zoom 同値ケースの division by zero 回避 (`hi.zoom !== lo.zoom` ガード) ✅

### 4. エッジケース ✅

| ケース | コード | 結果 |
|---|---|---|
| `length === 0` | `if (breakpoints.length === 0) return;` | ✅ |
| `length === 1` | `narrowBy = breakpoints[0].narrowBy;` | ✅ |
| narrowBy > maxNarrow | `console.warn(...)` + `Math.min(narrowBy, maxNarrow)` でクランプ | ✅ FR-04 |
| narrowBy < 0 | `Math.max(0, narrowBy)` で 0 にクランプ | ✅ |
| ズーム値が全BP範囲外 | lo/hi が端点のまま → lerp が clamp されて端点値に | ✅ |
| zoom 同値 (division by zero) | `hi.zoom !== lo.zoom` ガード → t=0 | ✅ |

### 5. 既存コードへの影響なし ✅

- プロジェクト全体で `inset` プロパティの参照は **0件**（docs/logs の履歴を除く）
- `narrowBy` プロパティの参照は `mapConfig.ts` と `boundsBound.ts` のみ
- `boundsBoundary` の使用元: `MapScreen.tsx` L61 — インターフェース変更なし、問題なし ✅

### 6. 後方互換性 ⚠️ 推奨事項

- `inset` → `narrowBy` は破壊的変更（REQ-compass-002 で定義済み、設計上の決定）
- リリースノート/CHANGELOG に以下を記載することを推奨:
  > **BREAKING**: `dynamicCenter.breakpoints` のプロパティ名を `inset` から `narrowBy` に変更

---

## コード品質所見

- `narrowByToBounds` が純粋関数として分離されておりテスト容易 ✅
- ロジックの流れ: breakpoints探索 → narrowBy補間 → 座標変換 → クランプ、明確で追いやすい ✅
- console.warn のメッセージに実測値 (narrowBy, maxNarrow) を含みデバッグ容易 ✅
- proj4 ベースの LOCAL_XY 変換を使用したメートル精度計算 ✅

---

## HANDOFF

**status:** 承認

**capacity:** TST への引き継ぎ準備完了

**artifacts:**
- `mapConfig.ts` — dynamicCenter.breakpoints 定義
- `boundsBound.ts` — narrowByToBounds / boundsBoundary

**open_questions:** なし

**routing:** → TST (Testing Phase)

**action_items:**
- TST にて以下をテスト推奨:
  1. narrowBy=0 で maxBounds と一致すること
  2. narrowBy=80 で適切に狭まること
  3. narrowBy > maxNarrow で console.warn が出ること + クランプ
  4. ブレークポイント1つのケース
  5. ズーム範囲外での動作
  6. zoom 同値のエッジケース
- REL にリリースノートの破壊的変更記載を依頼
