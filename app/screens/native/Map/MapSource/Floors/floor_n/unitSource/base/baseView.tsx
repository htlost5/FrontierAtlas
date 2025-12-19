import { ShapeSource } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import StairLayers from "./layers/StairLayers";
import WallLayers from "./layers/WallLayers";
import AtliumLayers from "./layers/AtriumLayers";

type Props = {
  floor_num: number;
  data: FeatureCollection;
  stairData: FeatureCollection;
};

export default function BaseView({ floor_num, data, stairData }: Props) {
  const baseSourceId = `baseView-${floor_num}`;
  return (
    <>
      <ShapeSource id={baseSourceId} shape={data}>
        <AtliumLayers floor_num={floor_num} sourceId={baseSourceId} />
        <WallLayers floor_num={floor_num} sourceId={baseSourceId} />
      </ShapeSource>

      <StairLayers floor_num={floor_num} data={stairData} />
    </>
  );
}
