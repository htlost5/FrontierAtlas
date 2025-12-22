import type { FeatureCollection } from "geojson";
import LabelView from "../../labels/label";
import FloorN_section from "./section";
import UnitView from "./unitSource/unitView";

type Props = {
  floor_num: number;
  geoData: {
    unit: FeatureCollection;
    section: FeatureCollection;
    stair: FeatureCollection;
  };
  display: number;
  zoomLevel: number;
};

export default function FloorN({ floor_num, geoData, display }: Props) {
  if (!geoData) {
    return null; // ローディング中は null でも可、スピナーを入れても良い
  }

  return (
    <>
      <FloorN_section floor_num={floor_num} data={geoData.section} />
      <UnitView
        floor_num={floor_num}
        data={geoData.unit}
        stairData={geoData.stair}
      />
      <LabelView floor_num={floor_num} data={geoData.unit} display={display} />
    </>
  );
}
