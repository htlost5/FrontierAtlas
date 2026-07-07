// エレベーター表示コンポーネント: エレベーターアイコンをマップ上に表示
import {
  Images,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

/**
 * エレベーター表示コンポーネントのプロパティ定義
 * @property data - エレベーターのポイントGeoJSONデータ
 * @property isVisible - 表示詳細度レベル（0: 非表示, 1以上: 表示）
 * @property floor_num - フロア番号
 */
type Props = {
  data: FeatureCollection;
  isVisible: number;
  floor_num: number;
};

/**
 * エレベーター表示コンポーネント
 * - エレベーターアイコンをズームレベルに応じたサイズで表示
 * - isVisible フラグで表示/非表示を制御
 * @param data - ポイントGeoJSONデータ
 * @param isVisible - 表示詳細度
 * @param floor_num - フロア番号
 * @returns エレベーターシンボルレイヤー
 */
export function Elevator({ data, isVisible, floor_num }: Props) {
  return (
    <>
      <Images
        id={`elevator_icons-images`}
        images={{
          elevator: require("@/assets/images/icons/MapView/MapLogo/elevator/elevator.png"),
        }}
      />
      <ShapeSource id={`elevator-symbol`} shape={data}>
        <SymbolLayer
          id={`elevator-symbol`}
          filter={["==", ["get", "category"], "elevator"]}
          style={{
            iconImage: "elevator",
            iconSize: [
              "interpolate",
              ["linear"],
              ["zoom"],
              17.9,
              0.016,
              21.1,
              0.11,
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
