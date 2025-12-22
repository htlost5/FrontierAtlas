import { ShapeSource } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import StairLayers from "./layers/others/StairLayers";
import { BASE_CONFIGS } from "./layers/share/baseConfigs";
import { PolygonLayer } from "@/components/MapUI/unitComp/shareComp";

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
        <PolygonLayer
          floor_num={floor_num}
          sourceId={baseSourceId}
          config={BASE_CONFIGS.atrium}
        />
        <PolygonLayer
          floor_num={floor_num}
          sourceId={baseSourceId}
          config={BASE_CONFIGS.wall}
        />
      </ShapeSource>

      <StairLayers floor_num={floor_num} data={stairData} />
    </>
  );
}
