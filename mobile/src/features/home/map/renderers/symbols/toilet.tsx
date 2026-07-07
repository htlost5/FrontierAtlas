// トイレ表示コンポーネント: 男性・女性・多機能トイレアイコンをマップ上に表示
// source/labels/iconSources/unit/symbols/toilet.tsx から移植
import type { FeatureCollection } from "geojson";
import { MapSymbolIcon } from "./MapSymbolIcon";

type Props = {
  data: FeatureCollection;
  isVisible: number;
};

/**
 * トイレ表示コンポーネント
 * - 男性・女性・多機能トイレのアイコンを表示
 * - MapSymbolIcon 共通コンポーネントを3回呼び出し
 */
export function Toilet({ data, isVisible }: Props) {
  return (
    <>
      <MapSymbolIcon
        iconId="toilet_icons-images"
        layerId="male-symbol"
        sourceId="toilet-shape"
        iconName="male"
        iconImage={require("@/assets/images/icons/MapView/MapLogo/toilet/male.png")}
        data={data}
        filter={["==", ["get", "category"], "restroom_male"]}
        iconSizeBase={0.03}
        isVisible={isVisible}
      />
      <MapSymbolIcon
        iconId="toilet_icons-images"
        layerId="female-symbol"
        sourceId="toilet-shape"
        iconName="female"
        iconImage={require("@/assets/images/icons/MapView/MapLogo/toilet/female.png")}
        data={data}
        filter={["==", ["get", "category"], "restroom_female"]}
        iconSizeBase={0.03}
        isVisible={isVisible}
      />
      <MapSymbolIcon
        iconId="toilet_icons-images"
        layerId="wheelChair-symbol"
        sourceId="toilet-shape"
        iconName="wheelchair"
        iconImage={require("@/assets/images/icons/MapView/MapLogo/toilet/wheelchair.png")}
        data={data}
        filter={["==", ["get", "category"], "restroom_accessible"]}
        iconSizeBase={0.03}
        isVisible={isVisible}
      />
    </>
  );
}
