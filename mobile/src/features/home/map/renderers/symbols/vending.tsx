// 自販機表示コンポーネント: 自販機アイコンをマップ上に表示
// source/labels/iconSources/unit/symbols/vending.tsx から移植
import type { FeatureCollection } from "geojson";
import { MapSymbolIcon } from "./MapSymbolIcon";

type Props = {
  data: FeatureCollection;
  isVisible: number;
};

/**
 * 自販機表示コンポーネント
 * - 自販機アイコンをズームレベルに応じたサイズで表示
 * - MapSymbolIcon 共通コンポーネントを使用
 */
export function Vending({ data, isVisible }: Props) {
  return (
    <MapSymbolIcon
      iconId="vending_icons-images"
      layerId="vending-symbol"
      sourceId="vending-shape"
      iconName="vending"
      iconImage={require("@/assets/images/icons/MapView/MapLogo/vending/vending-machine.png")}
      data={data}
      filter={["==", ["get", "category"], "vending_area"]}
      iconSizeBase={0.06}
      isVisible={isVisible}
    />
  );
}
