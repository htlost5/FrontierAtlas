// 自販機表示コンポーネント: 自販機アイコンをマップ上に表示
import {
  Images,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

/**
 * 自販機表示コンポーネントのプロパティ定義
 * @property data - 自販機のポイントGeoJSONデータ
 * @property isVisible - 表示詳細度レベル（0: 非表示, 1以上: 表示）
 * @property floor_num - フロア番号
 */
type Props = {
  data: FeatureCollection;
  isVisible: number;
  floor_num: number;
};

/**
 * 自販機表示コンポーネント
 * - 自販機アイコンをズームレベルに応じたサイズで表示
 * - isVisible フラグで表示/非表示を制御
 * @param data - ポイントGeoJSONデータ
 * @param isVisible - 表示詳細度
 * @param floor_num - フロア番号
 * @returns 自販機シンボルレイヤー
 */
export function Vending({ data, isVisible, floor_num }: Props) {
  return (
    <>
      <Images
        id={`vending_icons-images-${floor_num}`}
        images={{
          vending: require("@/assets/images/icons/MapView/MapLogo/vending/vending-machine.png"),
        }}
      />
      <ShapeSource id={`vending-shape-${floor_num}`} shape={data}>
        <SymbolLayer
          id={`vending-symbol-${floor_num}`}
          filter={["==", ["get", "category"], "vending_area"]}
          style={{
            iconImage: "vending",
            iconSize: [
              "interpolate",
              ["linear"],
              ["zoom"],
              17.9,
              0.02,
              21.1,
              0.13,
            ],
            iconRotationAlignment: "map",
            visibility: isVisible ? "visible" : "none",
            textAllowOverlap: true,
            iconAllowOverlap: true,
            textIgnorePlacement: true,
          }}
        />
      </ShapeSource>
    </>
  );
}
