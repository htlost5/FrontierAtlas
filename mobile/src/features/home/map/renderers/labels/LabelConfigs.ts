// カテゴリ別ラベル表示設定
import { LabelConfig } from "@/src/features/home/map/renderers/labels/LabelConfig";
import type { RoomCategory } from "@/src/features/home/map/constants/colorPalette";
import type { ColorTheme } from "@/src/features/home/map/constants/colorPalette";
import { buildCategoryFilter } from "@/src/features/home/map/layers/floor/unit/rooms/configs";

export type LabelKey = RoomCategory;

const overrides: Partial<Record<LabelKey, Partial<LabelConfig>>> = {
  sanitary: {
    iconVisible: false,
    textVisible: false,
  },
};

export function createLabelConfigs(
  colorTheme: ColorTheme,
): Record<LabelKey, LabelConfig> {
  const categories: RoomCategory[] = [
    "learning",
    "laboratory",
    "creative",
    "meeting",
    "staff",
    "social",
    "sanitary",
    "circulation",
  ];

  return Object.fromEntries(
    categories.map((cat) => [
      cat,
      {
        key: cat,
        filter: buildCategoryFilter(cat),
        textColor: colorTheme.label.textColor,
        textHaloColor: colorTheme.label.textHaloColor,
        textHaloWidth: colorTheme.label.textHaloWidth,
        iconVisible: true,
        textVisible: true,
        ...overrides[cat],
      },
    ]),
  ) as Record<LabelKey, LabelConfig>;
}

import { LIGHT_THEME } from "@/src/features/home/map/constants/colorPalette";
export const LABEL_CONFIGS: Record<LabelKey, LabelConfig> =
  createLabelConfigs(LIGHT_THEME);
