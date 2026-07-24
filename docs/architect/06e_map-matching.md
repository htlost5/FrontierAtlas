# 06e. Indoor Map Matching Engine（屋内空間制約エンジン）

## 1. 本節の目的

Indoor Map Matching Engine は、Position Fusion Engine が生成した推定位置を**建物の論理構造へ適合させる**。GPS の道路補正ではなく、建物内部の空間構造（通路・部屋・壁・階）へ位置を補正することを目的とする。

## 2. 責務

| 担当 | 非担当 |
|-----|-------|
| 通路制約・部屋制約による補正 | PDR |
| Node・Edge 制約による補正 | Fingerprint |
| Floor 制約による補正 | Wi-Fi / 地磁気 |
| 最終的な Matched Position の生成 | UI |

## 3. 設計思想

### 3.1 建物構造を唯一の正解とする

建物構造は Map Assets（ローカル座標版）から取得。Engine 自身は建物情報を持たない。入力データが既にローカル座標系で提供されるため、Map Matching Engine 内部での座標変換は不要。

### 3.2 Position Fusion と独立する

Fusion はセンサーだけから位置推定し、Indoor Map Matching は建物だけを見る。双方を独立させる。

### 3.3 GeoJSON に依存しない

GeoJSON は描画形式であり、直接扱わない。利用するのは Navigation Graph・Node・Edge などの**論理データ**。

## 4. モジュール構成

```text
IndoorMapMatchingEngine
├── CandidateSearcher       ← 推定位置付近の Node/Edge/Walkable Area 候補を探索（空間インデックス利用）
├── WalkableAreaValidator   ← 歩行可能領域（廊下/ホール/階段）内判定。壁/外部/設備スペースは除外
├── GraphMatcher            ← Navigation Graph と位置を対応付け（最寄りEdge/Node、Edge上への射影）
├── FloorMatcher            ← 階補正（階段付近→上下階候補、エレベータ→階移動、気圧→補助判定）
├── PositionCorrector       ← 最終位置補正（壁内部→通路中心、部屋内部→部屋中心、Edge外→Edge上）
├── ConstraintValidator     ← 不可能移動除外（1秒20m移動/壁貫通/Floor飛び→却下）
└── MatchingStateManager    ← Current Node/Edge/Room/Floor, Last Position を保持
```

## 5. 入出力

**入力**: `EstimatedPosition { Position, Heading, Floor, Confidence }` + Map Assets（Navigation Graph / Node / Edge / Walkable Area / Room Polygon / Floor）

**出力**: `MatchedPosition { Position, Heading, Floor, Matched Edge, Matched Node, Confidence }`

## 6. データフロー

```text
Fusion Position → Candidate Search → Walkable Validation → Graph Match
  → Floor Match → Constraint Validation → Position Correction
  → Matched Position
```

## 7. Graph 構造

Navigation Graph は Routing と Map Matching の両方で共有利用する：

```text
Node → Edge → Node → Edge → ...
```

## 8. 制約種別

| 制約 | 方針 |
|------|------|
| **通路制約** | 廊下中央などをあらかじめ設定した、Node, edgeを利用して補正 |
| **部屋制約** | Room Polygon 内判定。部屋外へ飛ばないよう補正 |
| **ノード制約** | 交差点付近では Node を優先。経路変更判定を容易にする |

## 9. Confidence 補正

Map Matching Engine は Position Fusion から受け取った `Confidence.value` に対して、建物構造制約に基づく**乗算補正**を適用する。補正後の Confidence は統一 Confidence 型として出力する。

| 状況 | 補正係数 | 説明 |
|------|---------|------|
| 位置が壁内部と判定 | ×0.5 | 建物構造上ありえない位置のため信頼度を半減 |
| Navigation Graph の Edge 上に一致 | ×1.1（上限 1.0） | 通路・経路上に乗っているため微増 |
| 不正なフロア遷移（階段・エレベータなしでの階変更） | ×0.3 | 物理的に不可能な移動のため大幅減 |
| 通常（歩行可能領域内） | ×1.0 | 変更なし |

複数の条件に該当する場合は、最も小さい補正係数を優先する（安全側に倒す）。

> **注**: 旧設計の Up / Down 2値方式は廃止。補正は Fusion から受け取った Confidence に対する相対操作であり、Map Matching が独自の Confidence 尺度を持たない。

## 10. 他レイヤとの関係

- **Event Engine**: Indoor Map Matching が最終位置（Matched Position）を生成し、その結果のみ Event Engine が通知する。Fusion の結果は直接通知しない。
- **React Native**: Matched Position のみ受け取る。Fusion Position は受け取らない。
