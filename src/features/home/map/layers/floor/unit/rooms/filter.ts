import { filterMaker } from "@/src/features/home/map/renderers/expressions/filterMaker";

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

export type RoomKey = keyof typeof ROOM_CATEGORIES;

export const ROOM_KEYS = Object.keys(ROOM_CATEGORIES) as RoomKey[];

export const ROOM_FILTERS = filterMaker(ROOM_CATEGORIES);
