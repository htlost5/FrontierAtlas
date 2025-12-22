export default function filterMaker<T extends Record<string, string>>(
  categories: T
) {
  type Category = T[keyof T];

  const categoryFilter = (category: Category) =>
    ["==", ["get", "category"], category] as const;

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
