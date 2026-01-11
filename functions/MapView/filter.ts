// Maplibreフィルタ生成ユーティリティ: カテゴリベースの型安全なフィルタを作成する関数
/**
 * Maplibreのカテゴリフィルタを型安全に生成する
 * - カテゴリオブジェクトからMaplibreフィルタ式を作成
 * - 各カテゴリキーに対応するフィルタを自動生成
 * @param categories - カテゴリ名とその値のマッピングオブジェクト
 * @returns カテゴリごとのフィルタ式オブジェクト
 */
export default function filterMaker<T extends Record<string, string>>(
  categories: T
) {
  // カテゴリの値の型
  type Category = T[keyof T];

  // カテゴリフィルタ式を生成するヘルパー関数
  const categoryFilter = (category: Category) =>
    ["==", ["get", "category"], category] as const;

  // カテゴリごとにフィルタを作成
  const filters = Object.fromEntries(
    (Object.keys(categories) as (keyof T)[]).map((key) => [
      key,
      categoryFilter(categories[key]),
    ])
  ) as {
    readonly [k in keyof T]: ReturnType<typeof categoryFilter>;
  };

  return filters;
}
