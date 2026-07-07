// 特殊シンボル統合コンポーネント: トイレ、エレベーター、自販機をまとめて描画
// source/labels/iconSources/unit/unit-label.tsx から移植
import type { FeatureCollection } from "geojson";
import { Elevator } from "./symbols/elevator";
import { Toilet } from "./symbols/toilet";
import { Vending } from "./symbols/vending";

type Props = {
  pointData: FeatureCollection | null;
  isVisible: number;
};

/**
 * 特殊シンボル統合コンポーネント
 * - Vending: 自販機アイコン
 * - Toilet: トイレアイコン
 * - Elevator: エレベーターアイコン
 */
export function UnitSymbol({ pointData, isVisible }: Props) {
  if (!pointData) return null;

  return (
    <>
      <Vending data={pointData} isVisible={isVisible} />
      <Toilet data={pointData} isVisible={isVisible} />
      <Elevator data={pointData} isVisible={isVisible} />
    </>
  );
}
