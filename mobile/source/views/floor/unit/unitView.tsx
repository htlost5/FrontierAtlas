// ユニット統合表示コンポーネント: 部屋と階段を基本レイヤーと部屋レイヤーで描画
import type { FeatureCollection } from "geojson";
import { BaseView } from "./source/01_base/baseView";
import { RoomView } from "./source/02_room/roomView";

/**
 * ユニット表示コンポーネントのプロパティ定義
 * @property floor_num - フロア番号
 * @property data - 部屋（ユニット）のGeoJSONデータ
 * @property stairData - 階段のGeoJSONデータ
 */
type Props = {
  floor_num: number;
  data: FeatureCollection;
  stairData: FeatureCollection;
};

/**
 * ユニット統合描画コンポーネント
 * - BaseView: 基本的な部屋レイヤー（階段含む）
 * - RoomView: 詳細な部屋レイヤーと対話機能
 * を並行して描画
 * @param floor_num - フロア番号
 * @param data - 部屋GeoJSONデータ
 * @param stairData - 階段GeoJSONデータ
 * @returns 部屋と階段のレイヤー群
 */
export function UnitView({ floor_num, data, stairData }: Props) {
  return (
    <>
      <BaseView floor_num={floor_num} data={data} stairData={stairData} />
      <RoomView floor_num={floor_num} data={data} />
    </>
  );
}
