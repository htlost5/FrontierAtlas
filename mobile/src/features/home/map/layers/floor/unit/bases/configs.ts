// configs レイヤ描画を定義する。
import { LayerConfig } from "../../../../components/mapComp/PolygonLayer/types";
import { BASE_FILTERS, BaseKey } from "./filters";
import type { ColorTheme } from "../../../../constants/colorPalette";

export function getBaseConfigs(
  colorTheme: ColorTheme,
): Record<BaseKey, LayerConfig> {
  return {
    atrium: {
      filter: BASE_FILTERS.atrium,
      fillStyle: { fillColor: colorTheme.atrium.fill },
      lineStyle: { lineColor: colorTheme.atrium.line, lineWidth: 1 },
    },
    wall: {
      filter: BASE_FILTERS.wall,
      fillStyle: { fillColor: colorTheme.walls.fill },
      lineStyle: { lineColor: colorTheme.walls.line, lineWidth: 1 },
    },
  } as const;
}
