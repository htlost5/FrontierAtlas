// configs レイヤ描画を定義する。
import { LayerConfig } from "../../../../components/mapComp/PolygonLayer/types";
import { BASE_FILTERS, BaseKey } from "./filters";

export const BASE_CONFIGS: Record<BaseKey, LayerConfig> = {
  atrium: {
    filter: BASE_FILTERS.atrium,
    fillStyle: {
      fillColor: "#C9D2B0",
    },
    lineStyle: {
      lineColor: "rgba(0,0,0,0.2)",
    },
  },
  wall: {
    filter: BASE_FILTERS.wall,
    fillStyle: {
      fillColor: "#B0B0B0",
    },
    lineStyle: {
      lineColor: "rgba(0,0,0,0.2)",
    },
  },
} as const;
