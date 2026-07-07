// 基本レイヤーコンポーネント: アトリウムと壁のレイヤーを描画
import { PolygonLayer } from "@/source/views/floor/unit/unitComp/shareComp";
import { ShapeSource } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { StairLayers } from "./layers/others/StairLayers";
import { BASE_CONFIGS } from "./layers/share/baseConfigs";

/**
 * 基本レイヤーコンポーネントのプロパティ定義
 * @property floor_num - フロア番号
 * @property data - 基本要素（アトリウム、壁）のGeoJSONデータ
 * @property stairData - 階段のGeoJSONデータ
 */
type Props = {
  floor_num: number;
  data: FeatureCollection;
  stairData: FeatureCollection;
};

/**
 * 基本レイヤーコンポーネント
 * - BASE_CONFIGS に定義されたアトリウムと壁を描画
 * - StairLayers で階段を描画
 * @param floor_num - フロア番号
 * @param data - 基本要素GeoJSONデータ
 * @param stairData - 階段GeoJSONデータ
 * @returns 基本レイヤー（アトリウム、壁、階段）
 */
export function BaseView({ floor_num, data, stairData }: Props) {
  const baseSourceId = `baseView`;

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
