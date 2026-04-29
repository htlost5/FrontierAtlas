// configs レイヤ描画を定義する。
import {
    FillLayerStyle,
    LineLayerStyle,
} from "@maplibre/maplibre-react-native";
import { LayerConfig } from "../../../../components/mapComp/PolygonLayer/types";
import { ROOM_FILTERS, RoomKey } from "./filter";

const TRANSPARENT_FILL: FillLayerStyle = {
  fillColor: "rgba(0,0,0,0)",
};

const TRANSPARENT_LINE: LineLayerStyle = {
  lineColor: "rgba(0,0,0,0)",
};

const overrides: Partial<Record<RoomKey, Partial<LayerConfig>>> = {
  lounge: {
    fillStyle: TRANSPARENT_FILL,
    lineStyle: TRANSPARENT_LINE,
  },
  lobby: {
    fillStyle: TRANSPARENT_FILL,
    lineStyle: TRANSPARENT_LINE,
  },
  courtyard: {
    fillStyle: {
      fillColor: "#E6EDD6",
    },
    lineStyle: {
      lineColor: "#A8B996",
    },
  },
  terrace: {
    fillStyle: TRANSPARENT_FILL,
    lineStyle: {
      lineColor: "rgba(0,0,0,2)",
    },
  },
  informationLounge: {
    fillStyle: TRANSPARENT_FILL,
    lineStyle: TRANSPARENT_LINE,
  },
};

function createRoomConfigs(): Record<RoomKey, LayerConfig> {
  return Object.fromEntries(
    (Object.keys(ROOM_FILTERS) as RoomKey[]).map((key) => [
      key,
      {
        filter: ROOM_FILTERS[key],
        fillStyle: {
          fillColor: "#C7E6A1",
        },
        lineStyle: {
          lineColor: "#A8B996",
        },
        ...overrides[key],
      },
    ]),
  ) as Record<RoomKey, LayerConfig>;
}

export const ROOM_CONFIGS: Record<RoomKey, LayerConfig> = createRoomConfigs();
