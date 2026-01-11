// フィルタ定義ファイル: 部屋タイプ（教室、トイレなど）のMaplibreフィルタを生成
/**
 * 部屋タイプのカテゴリマッピング
 * - 教室系、専門教室、管理・職員、共用スペース、トイレなど
 * - 各カテゴリ名は GeoJSON の "category" プロパティの値に対応
 */
import filterMaker from "@/functions/MapView/filter";

const ROOM_CATEGORIES = {
  // 教室系
  classroom: "classroom",
  studyRoom: "study_room",
  library: "library",
  laboratory: "laboratory",
  preparationRoom: "preparation_room",

  // 専門教室
  itRoom: "it_room",
  artRoom: "art_room",
  calligraphyRoom: "calligraphy_room",
  craftRoom: "craft_room",
  sewingRoom: "sewing_room",
  homeEconomicsRoom: "home_economics_room",
  cookingRoom: "kitchen",
  audiovisualRoom: "audiovisual_room",
  musicRoom: "music_room",

  // 和室・多目的
  japaneseStyleRoom: "japanese_style_room",
  conferenceRoom: "conference_room",
  broadcastRoom: "broadcast_room",
  studioRoom: "studio_room",

  // 管理・職員
  staffRoom: "staff_room",
  office: "office",
  nurseOffice: "first_aid_room",
  printingRoom: "printing_room",

  // 更衣・収納
  lockerRoom: "locker_room",
  dressingRoom: "dressing_room",
  storageRoom: "storage_room",
  wasteRoom: "waste_room",

  // 共用・動線
  lobby: "lobby",
  lounge: "lounge",
  informationLounge: "information_lounge",
  courtyard: "courtyard",
  terrace: "terrace",
  vendingArea: "vending_area",
  elevator: "elevator",

  // トイレ
  restroomMale: "restroom_male",
  restroomFemale: "restroom_female",
  restroomAccessible: "restroom_accessible",

  // その他
  alumniRoom: "alumni_room",
  emergencyArea: "emergency_area",
  privateLounge: "private_lounge",
  generalRoom: "general_room",
  opentobelow: "open_to_below",
};

/**
 * 部屋タイプフィルタ
 * - filterMaker でカテゴリマッピングから Maplibre フィルタ式を生成
 * - ROOM_FILTERS[key] でそれぞれの部屋タイプのフィルタを取得可能
 */
export const ROOM_FILTERS = filterMaker(ROOM_CATEGORIES);
