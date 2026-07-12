---
agent: TST
task_id: TASK-fix-sortKey-inversion
date: 2026-07-12
status: approved
category: shared
destination: shared/impl/decisions/
tags:
  - TST
  - handoff
  - REL
---

## HANDOFF to REL
- **status**: success
- **confidence**: high
- **artifacts**:
  - `d:\htlost5-workspace\projects\frontieratlas\mobile\src\features\home\map\renderers\UnitSymbol.tsx`（修正済みコード）
  - `d:\htlost5-workspace\projects\frontieratlas\mobile\docs\logs\impl\testing\2026-07-12_TST_sortKey-fix-validation.md`（テストログ）
- **open_questions**: なし
- **routing**: REL → ORC
- **test_result**: 全テスト観点を通過。TypeScript コンパイルエラーなし、`symbolSortKey` は MapLibre 型定義に存在、sortKey 値（トイレ=1, エレベータ=2, その他=3）は仕様通り、`iconAllowOverlap: false` との論理整合性も正しい。
