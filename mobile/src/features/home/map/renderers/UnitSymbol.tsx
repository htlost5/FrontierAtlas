// 特殊シンボル統合コンポーネント
import type { FeatureCollection } from "geojson";
import { Elevator } from "./symbols/elevator";
import { Toilet } from "./symbols/toilet";

type Props = {
  pointData: FeatureCollection | null;
  isVisible: number;
};

export function UnitSymbol({ pointData, isVisible }: Props) {
  if (!pointData) return null;
  return (
    <>
      <Toilet data={pointData} isVisible={isVisible} />
      <Elevator data={pointData} isVisible={isVisible} />
    </>
  );
}
