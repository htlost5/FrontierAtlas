// filter: レイヤ描画を定義する。
import { filterMaker } from "@/src/features/home/map/renderers/expressions/filterMaker";

/** GeoJSON category 値 → 正規化キーのマッピング */
export const ROOM_CATEGORIES = {
  // learning（学習）
  classroom: "classroom",
  studyRoom: "study_room",
  library: "library",
  callRoom: "call_room",
  seminarRoom: "seminar_room",
  talkRoom: "talk_room",
  selfStudyRoom: "self_study_room",
  lectureRoom: "lecture_room",

  // laboratory（実験・研究）
  laboratory: "laboratory",
  preparationRoom: "preparation_room",
  chemistryLab: "chemistry_lab",
  physicsLab: "physics_lab",
  biologyLab: "biology_lab",
  environmentLab: "environment_lab",
  earthScienceLab: "earth_science_lab",
  nanoLab: "nano_lab",
  electronMicroscopeLab: "electron_microscope_lab",
  analysisLab: "analysis_lab",
  environmentLifeLab: "environment_life_lab",
  biochemistryLab: "biochemistry_lab",
  darkroom: "darkroom",
  cleanBench: "clean_bench",
  outdoorPractice: "outdoor_practice",
  chemicalPrepRoom: "chemical_prep_room",
  researchLab: "research_lab",

  // creative（創作）
  itRoom: "it_room",
  artRoom: "art_room",
  calligraphyRoom: "calligraphy_room",
  craftRoom: "craft_room",
  metalWoodWorkingRoom: "metal_woodworking_room",
  sewingRoom: "sewing_room",
  homeEconomicsRoom: "home_economics_room",
  cookingRoom: "kitchen",
  audiovisualRoom: "audiovisual_room",
  musicRoom: "music_room",
  broadcastRoom: "broadcast_room",
  studioRoom: "studio_room",
  presentationStudio: "presentation_studio",
  instrumentRoom: "instrument_room",
  practiceRoom: "practice_room",

  // meeting（会議・集会）
  conferenceRoom: "conference_room",
  japaneseStyleRoom: "japanese_style_room",
  japaneseRoom: "japanese_room",
  careerCounselingRoom: "career_counseling_room",
  privateLounge: "private_lounge",
  receptionRoom: "reception_room",

  // staff（職員）
  staffRoom: "staff_room",
  office: "office",
  nurseOffice: "first_aid_room",
  printingRoom: "printing_room",
  principalRoom: "principal_room",
  lecturerStaffRoom: "lecturer_staff_room",
  teacherStaffRoom: "teacher_staff_room",
  librarianRoom: "librarian_room",
  advisorRoom: "advisor_room",
  ptaRoom: "pta_room",

  // social（交流）
  lounge: "lounge",
  informationLounge: "information_lounge",
  studentCouncilRoom: "student_council_room",
  alumniRoom: "alumni_room",
  informationCorner: "information_corner",

  // sanitary（衛生）
  restroomMale: "restroom_male",
  restroomFemale: "restroom_female",
  restroomAccessible: "restroom_accessible",
  lockerRoom: "locker_room",
  dressingRoom: "dressing_room",

  // circulation（移動・設備）
  elevator: "elevator",
  stairs: "stairs",
  lobby: "lobby",
  entrance: "entrance",
  vendingArea: "vending_area",
  emergencyArea: "emergency_area",
  storageRoom: "storage_room",
  wasteRoom: "waste_room",
  courtyard: "courtyard",
  terrace: "terrace",
  openToBelow: "open_to_below",
  warehouse: "warehouse",
  bookStorage: "book_storage",
  garbageCollection: "garbage_collection",
  garden: "garden",
  balcony: "balcony",
  fireDoor: "fire_door",
  evacuationExit: "evacuation_exit",
  generalRoom: "general_room",
  concrete: "concrete",
} as const;

export type RoomKey = keyof typeof ROOM_CATEGORIES;
export const ROOM_KEYS = Object.keys(ROOM_CATEGORIES) as RoomKey[];
export const ROOM_FILTERS = filterMaker(ROOM_CATEGORIES);

/** GeoJSON ソースデータの typo を正規化するマップ */
export const CATEGORY_NORMALIZE_MAP: Record<string, string> = {
  conferenceconference_room: "conference_room",
  conferenceroom: "conference_room",
  "restroom.female": "restroom_female",
  "information-lounge": "information_lounge",
  labpratory: "laboratory",
  emergency_room: "emergency_area",
  storage: "storage_room",
  art_craft_room: "art_room",
};

/** GeoJSON feature の category プロパティを正規化する */
export function normalizeCategory(category: string | undefined | null): string {
  if (!category) return "";
  const normalized = CATEGORY_NORMALIZE_MAP[category];
  return normalized ?? category;
}
