import type { Expression } from "@maplibre/maplibre-react-native";

/**
 * currentFloor に応じた階段フィルタを生成
 * - 1F-3F: category="4-5" の Feature（4F-5F間専用階段）を除外
 * - 4F-5F: 全 Feature 表示
 */
export function buildStairsFilter(currentFloor: number): Expression {
  if (currentFloor === 4 || currentFloor === 5) {
    return ["literal", true];
  }
  return ["!=", ["get", "category"], "4-5"];
}
