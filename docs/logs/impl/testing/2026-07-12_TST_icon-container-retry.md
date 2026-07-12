---
agent: TST
task_id: TASK-icon-container-002
date: 2026-07-12
status: draft
category: log
destination: logs/impl/testing/
related:
  - "[convert-tabler-icons.ts](../../../../tools/map-assets/scripts/convert-tabler-icons.ts)"
  - "[MapIconRegistry.tsx](../../../../mobile/src/features/home/map/renderers/MapIconRegistry.tsx)"
  - "[LabelConfig.ts](../../../../mobile/src/features/home/map/renderers/labels/LabelConfig.ts)"
  - "[LabelConfigs.ts](../../../../mobile/src/features/home/map/renderers/labels/LabelConfigs.ts)"
  - "[shareComp.tsx](../../../../mobile/src/features/home/map/renderers/labels/shareComp.tsx)"
  - "[REV log](../review/2026-07-12_REV_icon-container-conversion.md)"
tags:
  - TST
  - icon-container
  - testing
  - retry
---

# Test Log: マップシンボルアイコン → 角丸四角コンテナ＋小アイコン（REV Retry）

## タスク概要

マップのシンボルアイコン表示を角丸四角コンテナ（96×96, rx=8）＋中央アイコン（56×56）に修正。
ライト/ダーク両テーマ対応。circulationのアイコン非表示。

## Test Results Summary

| # | Check | Status | Detail |
|---|---|---|---|
| T1 | TypeScript コンパイル | **PASS** | `npx tsc --noEmit` → エラー0件 |
| T2 | 生成PNG 14ファイル存在 | **PASS** | 7カテゴリ × 2テーマ = 14ファイル確認 |
| T3 | 旧PNG 8ファイル削除 | **PASS** | `ic_*`パターンの旧ファイルは存在しない |
| T4 | 変更5ファイルの実装確認 | **PASS** | 設計通りの実装（詳細下記） |
| T5 | circulation iconVisible: false | **PASS** | `LabelConfigs.ts` に設定済み |

## 総合判定: **PASS** ✅

全5テスト項目が PASS。REV承認済みコードに問題なし。RELへの引き継ぎ可能。

---

## 各テスト詳細

### T1: TypeScript コンパイル
- コマンド: `npx tsc --noEmit`
- 結果: 出力なし（エラー0件）
- 判定: **PASS**

### T2: 生成PNG 14ファイル確認
- パス: `mobile/assets/images/icons/MapView/map/categoryIcons/`
- ファイル一覧:

| カテゴリ | light | dark |
|----------|-------|------|
| learning | ✅ | ✅ |
| laboratory | ✅ | ✅ |
| creative | ✅ | ✅ |
| meeting | ✅ | ✅ |
| staff | ✅ | ✅ |
| social | ✅ | ✅ |
| sanitary | ✅ | ✅ |

- 判定: **PASS**（14ファイルすべて存在）

### T3: 旧PNG削除確認
- grep検索: `ic_creative|ic_learning|ic_meeting|ic_social|ic_staff|ic_laboratory|ic_sanitary`
- 結果: ヒットなし
- 判定: **PASS**

### T4: 変更5ファイルの実装確認

| ファイル | 確認内容 | 判定 |
|----------|---------|------|
| `convert-tabler-icons.ts` | 7カテゴリ × light/dark = 14ファイル生成。96×96(rx=8)角丸四角背景 + 56×56アイコン。テーマ別塗り色定義(LIGHT_ROOM_FILLS/DARK_ROOM_FILLS) | ✅ |
| `MapIconRegistry.tsx` | 14画像をimportしICON_IMAGESにマッピング。circulationは登録なし | ✅ |
| `LabelConfig.ts` | `iconVisible`, `textVisible`, `iconKey` を含む型定義 | ✅ |
| `LabelConfigs.ts` | 8カテゴリのconfig生成。`overrides` で sanitary (`iconVisible:false, textVisible:false`), circulation (`iconVisible:false`) | ✅ |
| `shareComp.tsx` | `iconImage` を `config.iconVisible` で制御。ズームレベル応じたサイズ調整。テキスト表示/非表示制御 | ✅ |

### T5: circulation iconVisible: false
- `LabelConfigs.ts` 14行目: `circulation: { iconVisible: false }`
- overrides適用後のdefault値上書きを確認
- 判定: **PASS**

---

## 備考

- sanitaryは `iconVisible: false, textVisible: false` によりアイコン・テキストとも非表示（Toiletコンポーネントで別途描画）
- circulationはアイコンのみ非表示（`iconVisible: false`）、テキスト表示は維持
- アイコン用PNGは96×96px。MapLibreのiconSizeでズームレベル17〜21で0.35〜0.55倍に拡大縮小
