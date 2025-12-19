const BASE_CATEGORIES = {
    atrium: "opentobelow",
    wall: "wall",
}

type Category = typeof BASE_CATEGORIES[keyof typeof BASE_CATEGORIES];

const categoryFilter = (category: Category) =>
["==", ["get", "category"], category] as const;

export const FILTERS = {
    atrium: categoryFilter(BASE_CATEGORIES.atrium),
    wall: categoryFilter(BASE_CATEGORIES.wall),
} as const;