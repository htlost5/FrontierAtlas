import { LayerConfig } from "@/components/MapUI/unitComp/LayerConfig";
import { ROOM_FILTERS } from "../../filters/filters";

export type RoomKey = keyof typeof ROOM_FILTERS;

const TRANSPARENT = "rgba(0, 0, 0, 0)";

const overrides: Partial<Record<RoomKey, Partial<LayerConfig>>> = {
  lounge: {
    fillColor: TRANSPARENT,
    lineColor: TRANSPARENT,
  },
  lobby: {
    fillColor: TRANSPARENT,
    lineColor: TRANSPARENT,
  },
  courtyard: {
    fillColor: "#E6EDD6",
    lineColor: "#A8B996",
  },
  terrace: {
    fillColor: TRANSPARENT,
    lineColor: "rgba(0, 0, 0, 2)",
  },
  informationLounge: {
    fillColor: TRANSPARENT,
    lineColor: TRANSPARENT,
  }
};

function createRoomConfigs(): Record<RoomKey, LayerConfig> {
  return Object.fromEntries(
    (Object.keys(ROOM_FILTERS) as RoomKey[]).map((key) => [
      key,
      {
        key,
        filter: ROOM_FILTERS[key],
        fillColor: "#C7E6A1",
        lineColor: "#A8B996",
        ...overrides[key],
      },
    ])
  ) as Record<RoomKey, LayerConfig>;
}

export const ROOM_CONFIGS: Record<RoomKey, LayerConfig> = createRoomConfigs();
