// filter: room category.json keys → GeoJSON category values のマッピング
// category.json のキー（structure を除く 38 キー）を直接 RoomKey として使用する。

/** category.json キー → GeoJSON カテゴリ値の配列 */
export const ROOM_CATEGORIES = {
  // learning（学習）
  classroom: "classroom",
  study_room: "study_room",
  library: "library",

  // laboratory（実験・研究）
  laboratory: "laboratory",
  prep_room: "prep_room",
  outdoor_space: "outdoor_space",

  // creative（創作）
  it_room: "it_room",
  art_room: "art_room",
  calligraphy_room: "calligraphy_room",
  workshop: "workshop",
  sewing_room: "sewing_room",
  cooking_room: "cooking_room",
  listening_room: "listening_room",
  music_room: "music_room",
  broadcasting_room: "broadcasting_room",
  studio_room: "studio_room",

  // meeting（会議・集会）
  meeting_room: "meeting_room",
  japanese_style_room: "japanese_style_room",

  // staff（職員）
  staff_room: "staff_room",
  nursery_room: "nursery_room",
  printing_room: "printing_room",

  // social（交流）
  lounge: "lounge",
  information_lounge: "information_lounge",

  // sanitary（衛生）
  male_restroom: "male_restroom",
  female_restroom: "female_restroom",
  accessible_restroom: "accessible_restroom",
  locker_area: "locker_area",
  changing_room: "changing_room",

  // circulation（移動・設備）
  elevator: "elevator",
  stairs: "stairs",
  lobby: "lobby",
  structure: "structure",
  vending: "vending",
  emergency_exit: "emergency_exit",
  storage: "storage",
  waste_room: "waste_room",
  courtyard: "courtyard",
  fire_door: "fire_door",
  atrium: "atrium",
} as const;

export type RoomKey = keyof typeof ROOM_CATEGORIES;
