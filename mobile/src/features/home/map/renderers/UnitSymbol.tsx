// 特殊シンボル統合コンポーネント（角丸四角背景＋白アイコン）
import { ShapeSource, SymbolLayer } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { iconSizeExpression } from "./expressions/expressionHelpers";

type Props = {
  pointData: FeatureCollection | null;
  isVisible: number;
};

/** 特殊シンボル定義: MapLibre Imagesキー → GeoJSON category値 */
// sortKey: iconAllowOverlap=false 時は値が小さいほど優先表示
const SPECIAL_SYMBOLS: {
  imageKey: string;
  category: string;
  sortKey: number;
}[] = [
  { imageKey: "special-toilet-male", category: "restroom_male", sortKey: 1 },
  {
    imageKey: "special-toilet-female",
    category: "restroom_female",
    sortKey: 1,
  },
  {
    imageKey: "special-toilet-accessible",
    category: "restroom_accessible",
    sortKey: 1,
  },
  { imageKey: "special-elevator", category: "elevator", sortKey: 2 },
  { imageKey: "special-vending", category: "vending_machine", sortKey: 3 },
  { imageKey: "special-locker", category: "locker", sortKey: 3 },
  {
    imageKey: "special-emergency-exit",
    category: "emergency_exit",
    sortKey: 3,
  },
];

export function UnitSymbol({ pointData, isVisible }: Props) {
  if (!pointData) return null;
  const visible = isVisible ? "visible" : "none";

  // 特殊シンボル設定
  return (
    <ShapeSource id="unit-symbols-source" shape={pointData}>
      {SPECIAL_SYMBOLS.map(({ imageKey, category, sortKey }) => (
        <SymbolLayer
          key={imageKey}
          id={`${imageKey}-layer`}
          filter={["==", ["get", "category"], category]}
          style={{
            iconImage: imageKey,
            iconSize: iconSizeExpression([
              [17, 0.15],
              [21, 0.35],
            ]),
            iconRotationAlignment: "auto",
            textRotationAlignment: "auto",
            visibility: visible,
            iconAllowOverlap: false,
            symbolSortKey: sortKey,
          }}
        />
      ))}
    </ShapeSource>
  );
}
