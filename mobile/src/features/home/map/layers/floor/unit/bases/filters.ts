// filters レイヤ描画を定義する。
import { filterMaker } from "../../../../renderers/expressions/filterMaker";

export const BASE_CATEGORIES = {
  atrium: "open_to_below",
  wall: "concrete",
};

export type BaseKey = keyof typeof BASE_CATEGORIES;

export const BASE_KEYS = Object.keys(BASE_CATEGORIES) as BaseKey[];

export const BASE_FILTERS = filterMaker(BASE_CATEGORIES);
