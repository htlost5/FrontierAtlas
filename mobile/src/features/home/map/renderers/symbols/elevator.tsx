// エレベーター表示コンポーネント: エレベーターアイコンをマップ上に表示
// source/labels/iconSources/unit/symbols/elevator.tsx から移植
import type { FeatureCollection } from "geojson";
import { MapSymbolIcon } from "./MapSymbolIcon";

type Props = {
  data: FeatureCollection;
  isVisible: number;
};

/**
 * エレベーター表示コンポーネント
 * - エレベーターアイコンをズームレベルに応じたサイズで表示
 */
export function Elevator({ data, isVisible }: Props) {
  return (
    <MapSymbolIcon
      iconId="elevator_icons-images"
      layerId="elevator-symbol"
      sourceId="elevator-symbol"
      iconName="elevator"
      iconImage={require("@/assets/images/icons/MapView/MapLogo/elevator/elevator.png")}
      data={data}
      filter={["==", ["get", "category"], "elevator"]}
      iconSizeBase={0.03}
      isVisible={isVisible}
    />
  );
}
