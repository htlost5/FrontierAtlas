// 特殊シンボルコンポーネント: トイレ、エレベーター、自販機などの特殊アイコンを描画
import type { FeatureCollection } from "geojson";
import Elevator from "./symbols/elevator";
import Toilet from "./symbols/toilet";
import Vending from "./symbols/vending";

/**
 * 特殊シンボルコンポーネントのプロパティ定義
 * @property pointData - 特殊シンボル（ポイント）のGeoJSONデータ
 * @property isVisible - 表示詳細度レベル（0: 非表示, 1: 概要, 2: 詳細）
 * @property floor_num - フロア番号
 */
type Props = {
  pointData: FeatureCollection | null;
  isVisible: number;
  floor_num: number;
};

/**
 * 特殊シンボル統合コンポーネント
 * - Vending: 自販機アイコン
 * - Toilet: トイレアイコン
 * - Elevator: エレベーターアイコン
 * をまとめて描画
 * @param pointData - ポイントGeoJSONデータ
 * @param isVisible - 表示詳細度
 * @param floor_num - フロア番号
 * @returns 特殊シンボル全体（Vending + Toilet + Elevator）
 */
export default function UnitSymbol({ pointData, isVisible, floor_num }: Props) {
  if (!pointData) return null;

  return (
    <>
      <Vending data={pointData} isVisible={isVisible} floor_num={floor_num} />
      <Toilet data={pointData} isVisible={isVisible} floor_num={floor_num} />
      <Elevator data={pointData} isVisible={isVisible} floor_num={floor_num} />
    </>
  );
}
