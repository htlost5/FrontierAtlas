// 基本レイヤー設定: アトリウムと壁の塗りつぶし色・枠線色を定義
import { LayerConfig } from "@/components/MapUI/unitComp/LayerConfig";
import { BASE_FILTERS } from "../../filters/filters";

/**
 * 基本レイヤーの設定定義
 * - atrium: アトリウム（多目的ホール）の色設定
 * - wall: 壁・柱の色設定
 * 各設定には filter（どのfeatureを対象とするか）、fillColor（塗りつぶし色）、lineColor（枠線色）を含む
 */
export const BASE_CONFIGS: Record<string, LayerConfig> = {
  atrium: {
    key: "atrium",
    filter: BASE_FILTERS.atrium,
    fillColor: "#C9D2B0",
    lineColor: "rgba(0,0,0,0.2)",
  },
  wall: {
    key: "wall",
    filter: BASE_FILTERS.wall,
    fillColor: "#B0B0B0",
    lineColor: "rgba(0,0,0,0.2)",
  },
};
