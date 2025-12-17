import type { FeatureCollection } from "geojson";
import Elevator from "./symbols/elevator";
import Toilet from "./symbols/toilet";
import Vending from "./symbols/vending";

type Props = {
  pointData: FeatureCollection | null;
  isVisible: number;
  floor_num: number;
};

export default function UnitSymbol({ pointData, isVisible, floor_num }: Props) {
  if (!pointData) return null;

  return (
    <>
      <Vending data={pointData} isVisible={isVisible} floor_num={floor_num}/>
      <Toilet data={pointData} isVisible={isVisible} floor_num={floor_num}/>
      <Elevator data={pointData} isVisible={isVisible} floor_num={floor_num}/>
    </>
  );
}
