// 特殊シンボル統合コンポーネント（角丸四角背景＋白アイコン）
// MapLibre 公式仕様: symbolSortKey は同一 SymbolLayer 内のフィーチャー間でのみ有効。
// iconAllowOverlap=false 時は値が小さいほど優先表示。
// 7個の個別レイヤーから1個の統合レイヤーに集約し、match expression でデータ駆動化。
import {
  Expression,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { iconSizeExpression } from "./expressions/expressionHelpers";

type Props = {
  pointData: FeatureCollection | null;
  isVisible: number;
};

/** category → iconImage マッピング（match expression） */
const iconImageExpression: Expression = [
  "match",
  ["get", "category"],
  "restroom_male",
  "special-toilet-male",
  "restroom_female",
  "special-toilet-female",
  "restroom_accessible",
  "special-toilet-accessible",
  "elevator",
  "special-elevator",
  "vending_machine",
  "special-vending",
  "locker",
  "special-locker",
  "emergency_exit",
  "special-emergency-exit",
  "",
] as unknown as Expression;

/**
 * category → symbolSortKey マッピング（match expression）
 * 値が小さいほど優先表示（iconAllowOverlap=false 時）
 */
const sortKeyExpression: Expression = [
  "match",
  ["get", "category"],
  "restroom_male",
  1,
  "restroom_female",
  1,
  "restroom_accessible",
  1, // トイレ系: 最高優先
  "elevator",
  2, // エレベータ: 中優先
  "vending_machine",
  3,
  "locker",
  3,
  "emergency_exit",
  3, // その他: 最低優先
  999, // fallback（最低優先）
] as unknown as Expression;

export function UnitSymbol({ pointData, isVisible }: Props) {
  if (!pointData) return null;
  const visible = isVisible ? "visible" : "none";

  return (
    <ShapeSource id="unit-symbols-source" shape={pointData}>
      <SymbolLayer
        id="unit-symbol-layer"
        style={{
          iconImage: iconImageExpression,
          iconSize: iconSizeExpression([
            [17, 0.15],
            [21, 0.35],
          ]),
          iconRotationAlignment: "auto",
          textRotationAlignment: "auto",
          visibility: visible,
          iconAllowOverlap: false,
          symbolSortKey: sortKeyExpression,
        }}
      />
    </ShapeSource>
  );
}
