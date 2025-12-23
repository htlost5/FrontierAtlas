import { LavelConfig } from "@/components/MapUI/lavelComp/LavelConfig";
import { ROOM_FILTERS } from "../../../Floors/floor_n/unitSource/02_room/filters/filters";

export type LavelKey = keyof typeof ROOM_FILTERS;

const overrides: Partial<Record<LavelKey, Partial<LavelConfig>>> = {
  lobby: {
    iconVisible: false,
  },
  lounge: {
    iconVisible: false,
  },
  informationLounge: {
    iconVisible: false,
  },
  courtyard: {
    iconVisible: false,
  },
  
  restroomMale: {
    textVisible: false,
    iconVisible: false,
  },
  restroomFemale: {
    textVisible: false,
    iconVisible: false,
  },
  restroomAccessible: {
    textVisible: false,
    iconVisible: false,
  },
  elevator: {
    textVisible: false,
    iconVisible: false,
  },
  vendingArea: {
    textVisible: false,
    iconVisible: false,
  },
  emergencyArea: {
    iconVisible: false,
  }
};

function createLabelConfigs(): Record<LavelKey, LavelConfig> {
  return Object.fromEntries(
    (Object.keys(ROOM_FILTERS) as LavelKey[]).map((key) => [
      key,
      {
        key,
        filter: ROOM_FILTERS[key],
        textColor: "#000000",
        iconVisible: true,
        textVisible: true,
        ...overrides[key],
      },
    ])
  ) as Record<LavelKey, LavelConfig>;
}

export const LAVEL_CONFIGS: Record<LavelKey, LavelConfig> =
  createLabelConfigs();
