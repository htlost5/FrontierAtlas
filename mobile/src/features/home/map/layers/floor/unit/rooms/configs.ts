// configs: 77カテゴリ→8 RoomCategory のマッピングとフィルタ生成
import type { Expression } from "@maplibre/maplibre-react-native";
import type { RoomCategory } from "../../../../constants/colorPalette";
import { ROOM_CATEGORIES, type RoomKey } from "./filter";

export type RoomCategoryGroup = RoomCategory;

/** 描画除外カテゴリ */
export const EXCLUDED_CATEGORIES: ReadonlySet<string> = new Set([
  "concrete",
  "general_room",
]);

/** 部屋キー → 8カテゴリ マッピング */
export const ROOM_CATEGORY_MAP: Record<string, RoomCategoryGroup> = {
  // learning
  classroom: "learning",
  studyRoom: "learning",
  library: "learning",
  callRoom: "learning",
  seminarRoom: "learning",
  talkRoom: "learning",
  selfStudyRoom: "learning",
  lectureRoom: "learning",

  // laboratory
  laboratory: "laboratory",
  preparationRoom: "laboratory",
  chemistryLab: "laboratory",
  physicsLab: "laboratory",
  biologyLab: "laboratory",
  environmentLab: "laboratory",
  earthScienceLab: "laboratory",
  nanoLab: "laboratory",
  electronMicroscopeLab: "laboratory",
  analysisLab: "laboratory",
  environmentLifeLab: "laboratory",
  biochemistryLab: "laboratory",
  darkroom: "laboratory",
  cleanBench: "laboratory",
  outdoorPractice: "laboratory",
  chemicalPrepRoom: "laboratory",
  researchLab: "laboratory",

  // creative
  itRoom: "creative",
  artRoom: "creative",
  calligraphyRoom: "creative",
  craftRoom: "creative",
  metalWoodWorkingRoom: "creative",
  sewingRoom: "creative",
  homeEconomicsRoom: "creative",
  cookingRoom: "creative",
  audiovisualRoom: "creative",
  musicRoom: "creative",
  broadcastRoom: "creative",
  studioRoom: "creative",
  presentationStudio: "creative",
  instrumentRoom: "creative",
  practiceRoom: "creative",

  // meeting
  conferenceRoom: "meeting",
  japaneseStyleRoom: "meeting",
  japaneseRoom: "meeting",
  careerCounselingRoom: "meeting",
  privateLounge: "meeting",
  receptionRoom: "meeting",

  // staff
  staffRoom: "staff",
  office: "staff",
  nurseOffice: "staff",
  printingRoom: "staff",
  principalRoom: "staff",
  lecturerStaffRoom: "staff",
  teacherStaffRoom: "staff",
  librarianRoom: "staff",
  advisorRoom: "staff",
  ptaRoom: "staff",

  // social
  lounge: "social",
  informationLounge: "social",
  studentCouncilRoom: "social",
  alumniRoom: "social",
  informationCorner: "social",

  // sanitary
  restroomMale: "sanitary",
  restroomFemale: "sanitary",
  restroomAccessible: "sanitary",
  lockerRoom: "sanitary",
  dressingRoom: "sanitary",

  // circulation
  elevator: "circulation",
  stairs: "circulation",
  lobby: "circulation",
  entrance: "circulation",
  vendingArea: "circulation",
  emergencyArea: "circulation",
  storageRoom: "circulation",
  wasteRoom: "circulation",
  courtyard: "circulation",
  terrace: "circulation",
  openToBelow: "circulation",
  warehouse: "circulation",
  bookStorage: "circulation",
  garbageCollection: "circulation",
  garden: "circulation",
  balcony: "circulation",
  fireDoor: "circulation",
  evacuationExit: "circulation",
  generalRoom: "circulation",
  concrete: "circulation",
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

/** 指定カテゴリのフィルタ式（除外カテゴリを自動除去） */
export function buildCategoryFilter(category: RoomCategory): Expression {
  const keys = Object.entries(ROOM_CATEGORY_MAP)
    .filter(([, cat]) => cat === category)
    .map(([key]) => ROOM_CATEGORIES[key as RoomKey] ?? key)
    .filter((geoValue) => !EXCLUDED_CATEGORIES.has(geoValue));

  if (keys.length === 0) {
    return [
      "in",
      ["get", "category"],
      ["literal", [""]],
    ] as unknown as Expression;
  }
  return [
    "in",
    ["get", "category"],
    ["literal", keys],
  ] as unknown as Expression;
}
