// configs: category.json キー → 8 RoomCategory のマッピングとフィルタ生成
import type { Expression } from "@maplibre/maplibre-react-native";
import type { RoomCategory } from "../../../../constants/colorPalette";
import { ROOM_CATEGORIES, type RoomKey } from "./filter";
import { isFeatureVisible } from "../../../../config/categoryDisplayConfig";

export type RoomCategoryGroup = RoomCategory;

/** category.json キー → 8カテゴリ マッピング（38 エントリ） */
export const ROOM_CATEGORY_MAP: Record<string, RoomCategoryGroup> = {
  // learning
  classroom: "learning",
  study_room: "learning",
  library: "learning",

  // laboratory
  laboratory: "laboratory",
  prep_room: "laboratory",
  outdoor_space: "laboratory",

  // creative
  it_room: "creative",
  art_room: "creative",
  calligraphy_room: "creative",
  workshop: "creative",
  sewing_room: "creative",
  cooking_room: "creative",
  listening_room: "creative",
  music_room: "creative",
  broadcasting_room: "creative",
  studio_room: "creative",

  // meeting
  meeting_room: "meeting",
  japanese_style_room: "meeting",

  // staff
  staff_room: "staff",
  nursery_room: "staff",
  printing_room: "staff",

  // social
  lounge: "social",
  information_lounge: "social",

  // sanitary
  male_restroom: "sanitary",
  female_restroom: "sanitary",
  accessible_restroom: "sanitary",
  locker_area: "sanitary",
  changing_room: "sanitary",

  // circulation
  elevator: "circulation",
  stairs: "circulation",
  lobby: "circulation",
  structure: "circulation",
  vending: "circulation",
  emergency_exit: "circulation",
  storage: "circulation",
  waste_room: "circulation",
  courtyard: "circulation",
  fire_door: "circulation",
  atrium: "circulation",
};

/** 全8カテゴリ */
export const CATEGORIES: RoomCategory[] = [
  "learning",
  "laboratory",
  "creative",
  "meeting",
  "staff",
  "social",
  "sanitary",
  "circulation",
];

/** 指定カテゴリのフィルタ式（visible=false を自動除去） */
export function buildCategoryFilter(category: RoomCategory): Expression {
  const values = Object.entries(ROOM_CATEGORY_MAP)
    .filter(([, cat]) => cat === category)
    .map(([key]) => ROOM_CATEGORIES[key as RoomKey])
    .filter(isFeatureVisible);

  if (values.length === 0) {
    return [
      "in",
      ["get", "category"],
      ["literal", [""]],
    ] as unknown as Expression;
  }
  return [
    "in",
    ["get", "category"],
    ["literal", values],
  ] as unknown as Expression;
}
