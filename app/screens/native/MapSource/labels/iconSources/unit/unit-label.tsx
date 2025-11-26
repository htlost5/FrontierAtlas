import type { FeatureCollection } from "geojson";
import Elevator from "./symbols/elevator";
import Toilet from "./symbols/toilet";
import Vending from "./symbols/vending";

type Props = {
  pointData: FeatureCollection | null;
  isVisible: boolean;
};

export default function UnitSymbol({ pointData, isVisible }: Props) {
  if (!pointData) return null;

  return (
    <>
      <Toilet data={pointData} show={isVisible} />
      <Elevator data={pointData} show={isVisible} />
      <Vending data={pointData} show={isVisible} />
    </>
  );
}
