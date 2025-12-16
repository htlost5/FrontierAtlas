import LabelView from "../../labels/label";
import FloorN_section from "./section";
import FloorN_unit from "./unit";
import type { FeatureCollection } from "geojson";

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

export default function FloorN({ floor_num, geoData, display}: Props) {
  if (!geoData) {
    return null; // ローディング中は null でも可、スピナーを入れても良い
  }

  return (
    <>
      <FloorN_section
        data={geoData.section}
        floor_num={floor_num}
      />
      <FloorN_unit
        data={geoData.unit}
        stairData={geoData.stair}
        floor_num={floor_num}
      />
      <LabelView
        floor_num={floor_num}
        data={geoData.unit}
        display={display}
      />
    </>
  );
}
