// 部屋レイヤーコンポーネント: ROOM_CONFIGS で定義されたすべての部屋タイプを描画
import { PolygonLayer } from "@/source/views/floor/unit/unitComp/shareComp";
import { ShapeSource } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { ROOM_CONFIGS, RoomKey } from "./layers/share/roomConfigs";

/**
 * 部屋レイヤーコンポーネントのプロパティ定義
 * @property floor_num - フロア番号
 * @property data - 部屋（ユニット）のGeoJSONデータ
 */
type Props = {
  floor_num: number;
  data: FeatureCollection;
};

/**
 * 部屋レイヤーコンポーネント
 * - ROOM_CONFIGS のすべてのキーをループして PolygonLayer を生成
 * - 部屋タイプごとに異なる色で塗りつぶし・枠線を描画
 * @param floor_num - フロア番号
 * @param data - 部屋GeoJSONデータ
 * @returns 部屋タイプ別のPolyonLayerリスト
 */
export function RoomView({ floor_num, data }: Props) {
  const roomSourceId = `roomView-${floor_num}`;

  return (
    <ShapeSource id={roomSourceId} shape={data}>
      {(Object.keys(ROOM_CONFIGS) as RoomKey[]).map((key) => (
        <PolygonLayer
          key={key}
          floor_num={floor_num}
          sourceId={roomSourceId}
          config={ROOM_CONFIGS[key]}
        />
      ))}
    </ShapeSource>
  );
}
