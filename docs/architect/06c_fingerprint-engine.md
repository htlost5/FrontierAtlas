# 06c. Fingerprint Engine（Wi-Fi・地磁気測位）

## 1. 本節の目的

Fingerprint Engine は、建物内で事前に収集した Wi-Fi Fingerprint および地磁気 Fingerprint と現在のセンサーデータを照合し、現在位置候補を推定する。**PDR の補正器ではなく、PDR と対等な測位エンジン**として位置付け、両者を Position Fusion Engine が統合する。

## 2. 責務

| 担当 | 非担当 |
|-----|-------|
| Wi-Fi スキャン結果の解析 | PDR |
| 地磁気データの解析 | Map Matching |
| Fingerprint DB との照合 | UI |
| 候補位置の抽出・信頼度算出 | React Native 通信 |
| Position Fusion への位置候補提供 | 地図描画 |

## 3. 設計思想

### 3.1 データ駆動

Fingerprint Engine は建物固有のロジックを持たない。利用する情報（Wi-Fi Fingerprint・地磁気 Fingerprint・Floor 情報・Metadata）はすべて Map Assets に含まれる。建物追加時のコード変更は不要。

### 3.2 Wi-Fi と地磁気を独立して評価

両者は同じアルゴリズムで扱わず、独立した Engine として評価し、最終結果を Fingerprint Engine が統合する。

### 3.3 複数候補を保持

最も一致する一点ではなく複数の候補位置を保持。Position Fusion は PDR の移動量と照らし合わせて最終位置を決定する。

## 4. モジュール構成

```text
FingerprintEngine
├── WifiFingerprintEngine      ← BSSID/RSSI/Frequency を解析、Wi-Fi 候補を生成
├── MagneticFingerprintEngine  ← 磁気ベクトル/Heading を解析、地磁気候補を生成
├── CandidateGenerator         ← Wi-Fi+地磁気の候補を統合
├── SimilarityCalculator       ← 類似度計算（交換可能：コサイン類似度/ユークリッド距離/MLモデル）
├── ConfidenceEstimator        ← 候補ごとの信頼度付与
└── FingerprintStateManager    ← 最新候補・Candidate List・Confidence・最終照合時刻を保持
```

## 5. 入出力

**入力**: Sensor Layer の出力（Wi-Fi: BSSID/RSSI/Frequency / 地磁気: X/Y/Z）+ Map Assets（Wi-Fi DB / Magnetic DB）

**出力**:
```text
FingerprintResult { Candidates[], Confidence, Floor, Timestamp, Source }
```
Source: `Wi-Fi` / `Magnetic` / `Hybrid`

## 6. データフロー

```text
Wi-Fi Scan → WifiFingerprintEngine ↘
                                      CandidateGenerator → SimilarityCalculator
Magnetic Sample → MagneticFingerprintEngine ↗                ↓
                                                     ConfidenceEstimator
                                                             ↓
                                                      FingerprintResult
```

## 7. フロア推定

Fingerprint Engine は位置だけでなく階情報も推定する。Wi-Fi・地磁気・Metadata を利用し、Position Fusion がこの結果を PDR と照合する。

## 8. Confidence 評価

Fingerprint Engine は統一 Confidence 型（`06_position-engine.md` §9 参照）を出力する。Wi-Fi と地磁気でそれぞれ独立に Confidence を算出し、FingerprintEngine が加重平均で統合する。

### 8.1 評価要素（Wi-Fi / 地磁気 共通）

| 評価要素 | 重み | 説明 |
|---------|------|------|
| 一致率 | 30% | RSSI / 地磁気ベクトルの類似度（コサイン類似度またはユークリッド距離を 0.0〜1.0 に正規化） |
| 利用可能 AP 数 | 20% | Wi-Fi 環境の充実度。AP 数が多いほど信頼度上昇（地磁気のみ利用時はこの要素を除外し他要素の重みを比例配分） |
| 地磁気安定性 | 25% | 周囲環境（金属・電子機器）の影響度。磁場ベクトルの分散が小さいほど高い |
| データ更新日時 | 15% | Fingerprint DB の収集日からの経過日数。新しいほど高い |
| センサー精度 | 10% | 現在の Wi-Fi / 地磁気センサーの品質 |

### 8.2 Wi-Fi / 地磁気の統合

```text
Wi-Fi Confidence ──────────┐
                           ├── 加重平均 → FingerprintResult.Confidence
地磁気 Confidence ─────────┘
```

両方利用可能な場合は均等重み（各 50%）。片方のみ利用可能な場合は利用可能側の Confidence をそのまま採用し、`Source` に `Wi-Fi` または `Magnetic` を記録する。

Position Fusion はこの `value` を重み付け計算に利用する。

## 9. エラー処理・縮退運転

| 状況 | 対応 |
|------|------|
| Wi-Fi 取得不可 | 地磁気のみ利用 |
| 地磁気利用不可 | Wi-Fi のみ利用 |
| 両方利用不可 | PDR のみ継続 |
| DB 読込失敗 | Position Controller へ通知 |

## 10. 他レイヤとの関係

- **PDR**: 相互に認識しない。Position Fusion が両者を統合する。
- **Map Matching**: Fingerprint Engine は建物構造を考慮しない（壁内部も候補になり得る）。補正は Map Matching が担当。
- **React Native**: 認識しない。最終結果は `Position Fusion → Map Matching → Event → Bridge → React Native` で通知。

## 11. キャッシュ

Fingerprint Database は起動時にロードし、毎回ファイルアクセスしない。更新時のみ再読込する。
