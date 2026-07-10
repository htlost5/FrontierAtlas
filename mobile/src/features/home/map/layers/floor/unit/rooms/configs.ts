// configs レイヤ描画を定義する。
import {
  FillLayerStyle,
  LineLayerStyle,
} from "@maplibre/maplibre-react-native";
import type { Expression } from "@maplibre/maplibre-react-native";
import { LayerConfig } from "../../../../components/mapComp/PolygonLayer/types";
import { ROOM_FILTERS, ROOM_CATEGORIES, RoomKey } from "./filter";

const TRANSPARENT_FILL: FillLayerStyle = {
  fillColor: "rgba(0,0,0,0)",
};

const TRANSPARENT_LINE: LineLayerStyle = {
  lineColor: "rgba(0,0,0,0)",
};

const overrides: Partial<Record<RoomKey, Partial<LayerConfig>>> = {
  lounge: { fillStyle: TRANSPARENT_FILL, lineStyle: TRANSPARENT_LINE },
  lobby: { fillStyle: TRANSPARENT_FILL, lineStyle: TRANSPARENT_LINE },
  courtyard: {
    fillStyle: { fillColor: "#E6EDD6" },
    lineStyle: { lineColor: "#A8B996" },
  },
  terrace: {
    fillStyle: TRANSPARENT_FILL,
    lineStyle: { lineColor: "rgba(0,0,0,0.2)" },
  },
  informationLounge: {
    fillStyle: TRANSPARENT_FILL,
    lineStyle: TRANSPARENT_LINE,
  },
};

// ──────────────────────────────────────────────
// DD-01: スタイルグループ定義（ShapeSource グループ化統合）
// ──────────────────────────────────────────────

/** スタイルグループ種別 */
export type RoomStyleGroup =
  | "default"
  | "courtyard"
  | "terrace"
  | "transparent";

/**
 * RoomKey → RoomStyleGroup のマッピング
 * overrides の内容に基づいて振り分ける
 */
export function getRoomStyleGroup(key: RoomKey): RoomStyleGroup {
  const override = overrides[key];
  if (!override) return "default";

  const fillTransparent = override.fillStyle?.fillColor === "rgba(0,0,0,0)";
  const lineTransparent = override.lineStyle?.lineColor === "rgba(0,0,0,0)";

  if (fillTransparent && lineTransparent) return "transparent";
  if (override.fillStyle?.fillColor === "#E6EDD6") return "courtyard";
  if (key === "terrace") return "terrace";
  return "default";
}

/** 全 RoomKey をスタイルグループごとに分類 */
export const ROOM_STYLE_GROUPS: Record<RoomStyleGroup, RoomKey[]> = {
  default: [],
  courtyard: [],
  terrace: [],
  transparent: [],
};

const _allKeys = Object.keys(ROOM_FILTERS) as RoomKey[];
for (const key of _allKeys) {
  ROOM_STYLE_GROUPS[getRoomStyleGroup(key)].push(key);
}

/** グループに属するカテゴリ値から ["in", ...] フィルタ式を生成 */
export function buildGroupFilter(group: RoomStyleGroup): Expression {
  const keys = ROOM_STYLE_GROUPS[group];
  return [
    "in",
    ["get", "category"],
    ["literal", keys.map((k) => ROOM_CATEGORIES[k])],
  ] as unknown as Expression;
}

/** グループごとのフィルタ式 */
export const GROUP_FILTERS: Record<RoomStyleGroup, Expression> = {
  default: buildGroupFilter("default"),
  courtyard: buildGroupFilter("courtyard"),
  terrace: buildGroupFilter("terrace"),
  transparent: buildGroupFilter("transparent"),
};

/** グループごとのスタイル定義（transparent はスキップ対象） */
export const GROUP_STYLE_CONFIGS: Record<
  Exclude<RoomStyleGroup, "transparent">,
  LayerConfig
> = {
  default: {
    filter: GROUP_FILTERS.default,
    fillStyle: { fillColor: "#C7E6A1" },
    lineStyle: { lineColor: "#A8B996" },
  },
  courtyard: {
    filter: GROUP_FILTERS.courtyard,
    fillStyle: { fillColor: "#E6EDD6" },
    lineStyle: { lineColor: "#A8B996" },
  },
  terrace: {
    filter: GROUP_FILTERS.terrace,
    fillStyle: { fillColor: "rgba(0,0,0,0)" },
    lineStyle: { lineColor: "rgba(0,0,0,0.2)" },
  },
};

// ──────────────────────────────────────────────
// 既存の個別設定（互換性維持）
// ──────────────────────────────────────────────

function createRoomConfigs(): Record<RoomKey, LayerConfig> {
  return Object.fromEntries(
    (Object.keys(ROOM_FILTERS) as RoomKey[]).map((key) => [
      key,
      {
        filter: ROOM_FILTERS[key],
        fillStyle: { fillColor: "#C7E6A1" },
        lineStyle: { lineColor: "#A8B996" },
        ...overrides[key],
      },
    ]),
  ) as Record<RoomKey, LayerConfig>;
}

export const ROOM_CONFIGS: Record<RoomKey, LayerConfig> = createRoomConfigs();
