---
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript / React 実装ルール

## 型安全

- `strict` 前提で実装する。
- `any` は境界層の最小範囲に限定し、可能なら `unknown` + 型ガードを使う。
- Context Hook は `if (!ctx) throw` を維持する。

## 命名

- コンポーネント/型: PascalCase
- 関数/変数: camelCase
- 定数: UPPER_SNAKE_CASE
- Hook: `useXxx`

## Hook規約

- `useEffect` は cancel-safe を維持する。
- 依存配列を省略しない。

## import規約（推奨）

1. 外部パッケージ
2. `@/` エイリアス
3. 相対パス
