// configs レイヤ描画を定義する。
// 40カテゴリの部屋を6つの機能ゾーングループに分類する。
import type { Expression } from "@maplibre/maplibre-react-native";
import type { ZoneType } from "../../../../constants/colorPalette";
import { ROOM_CATEGORIES, type RoomKey } from "./filter";

/** RoomZoneGroup = 6つの機能ゾーン */
export type RoomZoneGroup = ZoneType;

/** カテゴリ → ゾーン マッピング */
export const ROOM_ZONE_MAP: Record<string, RoomZoneGroup> = {
  classroom: "classroom",
  studyRoom: "classroom",
  library: "classroom",
  laboratory: "classroom",
  preparationRoom: "classroom",
  itRoom: "specialized",
  artRoom: "specialized",
  calligraphyRoom: "specialized",
  craftRoom: "specialized",
  metalWoodWorkingRoom: "specialized",
  sewingRoom: "specialized",
  homeEconomicsRoom: "specialized",
  cookingRoom: "specialized",
  audiovisualRoom: "specialized",
  musicRoom: "specialized",
  staffRoom: "administration",
  office: "administration",
  nurseOffice: "administration",
  printingRoom: "administration",
  conferenceRoom: "administration",
  broadcastRoom: "administration",
  studioRoom: "administration",
  lobby: "common",
  lounge: "common",
  informationLounge: "common",
  japaneseStyleRoom: "common",
  alumniRoom: "common",
  privateLounge: "common",
  restroomMale: "sanitary",
  restroomFemale: "sanitary",
  restroomAccessible: "sanitary",
  lockerRoom: "sanitary",
  dressingRoom: "sanitary",
  courtyard: "other",
  terrace: "other",
  vendingArea: "other",
  elevator: "other",
  storageRoom: "other",
  wasteRoom: "other",
  emergencyArea: "other",
  generalRoom: "other",
};

/** ゾーンごとのフィルタ式を生成 */
export function buildZoneFilter(zone: RoomZoneGroup): Expression {
  const keys = Object.entries(ROOM_ZONE_MAP)
    .filter(([_, z]) => z === zone)
    .map(([key]) => ROOM_CATEGORIES[key as RoomKey] ?? key);
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
