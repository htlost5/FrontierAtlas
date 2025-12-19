import type { FeatureCollection } from "geojson";
import BaseView from "./base/baseView";

type Props = {
  floor_num: number;
  data: FeatureCollection;
  stairData: FeatureCollection;
};

export default function UnitView({ floor_num, data, stairData }: Props) {

  return (
    <>
      <BaseView floor_num={floor_num} data={data} stairData={stairData} />
    </>
  );
}
