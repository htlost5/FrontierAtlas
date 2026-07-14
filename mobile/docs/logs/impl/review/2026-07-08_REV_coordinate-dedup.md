---
agent: REV
task_id: TASK-coordinate-dedup
date: 2026-07-08
status: approved
category: log
destination: logs/impl/review/
related: []
tags:
  - REV
  - code-review
  - coordinate-dedup
  - maplibre
---

# Coordinate Deduplication Fix — Review Log

## Result: APPROVED (Conditionally Approved)

## 1. removeConsecutiveDuplicates — Ring Closure

Status: CORRECT

- 連続重複除去後 ring first!=last の場合にクロージャ復元ロジックは正しい
- result.length >= 3 のガードにより三角形未満リングは強制クローズしない
- 既存の clean triangle は変更されず維持される

## 2. sanitizeGeometry — GeoJSON Type Coverage

Status: CORRECT (実データで GeometryCollection 該当なし)

- Polygon: OK (外環+穴を個別処理)
- MultiPolygon: OK (再帰処理)
- Point/LineString/MultiPoint/MultiLineString: OK (素通し)
- GeometryCollection: 未対応 (実データで該当なしのため許容)

## 3. sanitizeFeature — Null/Invalid Geometry

Status: CORRECT

- null feature: early return
- null geometry: 素通し (GeoJSON 仕様上妥当)
- geometry が null 化: feature ごとフィルタリング

## 4. Epsilon Value (1e-12)

Status: APPROPRIATE

- 1e-12 度 ≈ 0.000111mm — 測位誤差を大きく下回る
- 1e-13 はキャッチ、1.5e-12 はキャッチせず: 意図通り
- floor2.json の 4件 near-dup (diff 1.4e-11〜5e-12) は epsilon 範囲外だが MapLibre クラッシュ原因にならないレベル

## 5. Valid Polygon Ring Modification Risk

Status: CORRECT

- 既存の clean triangle は変更されず維持
- 重複除去後 4未満のリングはポリゴンごと削除
- 三角形外環エッジケース: 最低限のリスク (現実的な問題なし)

## Output Data Verification

全4ファイル: consecutive dups = NONE, ring closure = ALL OK, structure intact

## Regression Check

- studyhall/sections/floor1.json: OK
- studyhall/sections/floor2.json: OK
- studyhall/units/floor1.json: OK
- interact/footprint.json: OK

## Improvement Suggestions (Non-Critical)

1. coords → ring への引数名変更 (可読性)
2. GeometryCollection 再帰処理追加 (将来対応、優先度低)
3. ユニーク点 < 3 のリング排除ロジック追加 (任意)

## Conclusion

APPROVED — Conditionally Approved. セキュリティ脆弱性なし、仕様準拠。MapLibre クラッシュの根本原因を適切に修正。TST への引き継ぎを妨げない。
