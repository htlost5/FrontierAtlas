// 特殊シンボル統合コンポーネント（角丸四角背景＋白アイコン）
import { ShapeSource, SymbolLayer } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { iconSizeExpression } from "./expressions/expressionHelpers";

type Props = {
  pointData: FeatureCollection | null;
  isVisible: number;
};

/** 特殊シンボル定義: MapLibre Imagesキー → GeoJSON category値 */
const SPECIAL_SYMBOLS: { imageKey: string; category: string }[] = [
  { imageKey: "special-toilet-male", category: "restroom_male" },
  { imageKey: "special-toilet-female", category: "restroom_female" },
  { imageKey: "special-toilet-accessible", category: "restroom_accessible" },
  { imageKey: "special-elevator", category: "elevator" },
  { imageKey: "special-vending", category: "vending_machine" },
  { imageKey: "special-locker", category: "locker" },
  { imageKey: "special-emergency-exit", category: "emergency_exit" },
];

export function UnitSymbol({ pointData, isVisible }: Props) {
  if (!pointData) return null;
  const visible = isVisible ? "visible" : "none";

  return (
    <ShapeSource id="unit-symbols-source" shape={pointData}>
      {SPECIAL_SYMBOLS.map(({ imageKey, category }) => (
        <SymbolLayer
          key={imageKey}
          id={`${imageKey}-layer`}
          filter={["==", ["get", "category"], category]}
          style={{
            iconImage: imageKey,
            iconSize: iconSizeExpression([
              [17, 0.25],
              [20, 0.38],
            ]),
            iconRotationAlignment: "auto",
            textRotationAlignment: "auto",
            visibility: visible,
            iconAllowOverlap: true,
          }}
        />
      ))}
    </ShapeSource>
  );
}
