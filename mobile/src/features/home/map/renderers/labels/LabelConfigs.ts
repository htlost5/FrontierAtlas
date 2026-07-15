// カテゴリ別ラベル表示設定
import { LabelConfig } from "@/src/features/home/map/renderers/labels/LabelConfig";
import {
  LIGHT_THEME,
  type RoomCategory,
  type ColorTheme,
} from "@/src/features/home/map/constants/colorPalette";
import {
  buildCategoryFilter,
  ROOM_CATEGORY_MAP,
} from "@/src/features/home/map/layers/floor/unit/rooms/configs";
import {
  ROOM_CATEGORIES,
  type RoomKey,
} from "@/src/features/home/map/layers/floor/unit/rooms/filter";
import {
  getCategoryConfig,
  isLabelIconVisible,
  isLabelTextVisible,
} from "@/src/features/home/map/config/categoryDisplayConfig";

export type LabelKey = RoomCategory;

/**
 * 指定 RoomCategory に属する GeoJSON カテゴリ値のうち、
 * category.json に設定が存在するもののみを集約し、ラベル表示設定を決定する。
 * 未マッピングのカテゴリは集計から除外する。
 *
 * - 設定済みサブカテゴリが 1 つもない → フォールバック値を使用（sanitary/circulation のみ false）
 * - ANY の設定済みサブカテゴリで icon=true → iconVisible=true
 * - ANY の設定済みサブカテゴリで text=true → textVisible=true
 */
function buildLabelOverrides(): Partial<
  Record<LabelKey, Partial<LabelConfig>>
> {
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

  // 旧来のハードコードされた動作をフォールバックとして保持
  const overrides: Partial<Record<LabelKey, Partial<LabelConfig>>> = {
    sanitary: { iconVisible: false, textVisible: false },
    circulation: { iconVisible: false, textVisible: false },
  };

  for (const cat of categories) {
    // この RoomCategory に属する全 ROOM_CATEGORIES キーから GeoJSON 値を収集
    const geoValues = Object.entries(ROOM_CATEGORY_MAP)
      .filter(([, c]) => c === cat)
      .map(([key]) => ROOM_CATEGORIES[key as RoomKey]);

    // category.json に設定が存在するサブカテゴリのみを対象とする
    // 未マッピングのカテゴリは集計から除外する
    const configuredValues = geoValues.filter(
      (v) => getCategoryConfig(v) !== undefined,
    );

    // 設定済みサブカテゴリがない場合はフォールバックを維持（上書きしない）
    if (configuredValues.length === 0) continue;

    // ANY のサブカテゴリが icon=true → iconVisible=true
    const anyIcon = configuredValues.some((v) => isLabelIconVisible(v));
    // ANY のサブカテゴリが text=true → textVisible=true
    const anyText = configuredValues.some((v) => isLabelTextVisible(v));

    overrides[cat] = {
      iconVisible: anyIcon,
      textVisible: anyText,
    };
  }

  return overrides;
}

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

  const themeSuffix = colorTheme.id; // "light" | "dark"
  const overrides = buildLabelOverrides();

  return Object.fromEntries(
    categories.map((cat) => [
      cat,
      {
        key: cat,
        iconKey: `${cat}-${themeSuffix}`,
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

export const LABEL_CONFIGS: Record<LabelKey, LabelConfig> =
  createLabelConfigs(LIGHT_THEME);
