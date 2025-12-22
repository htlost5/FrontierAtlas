import { BASE_FILTERS } from "../../filters/filters";
import { LayerConfig } from "@/components/MapUI/unitComp/LayerConfig";

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