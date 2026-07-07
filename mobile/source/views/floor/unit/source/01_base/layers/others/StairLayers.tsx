// 階段描画コンポーネント: 階段をLineLayerで描画（色と太さを動的に変更）
import { LineLayer, ShapeSource } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

/**
 * 階段レイヤーコンポーネントのプロパティ定義
 * @property data - 階段のGeoJSONデータ
 * @property floor_num - フロア番号
 */
type Props = {
  data: FeatureCollection;
  floor_num: number;
};

/**
 * 階段描画コンポーネント
 * - フロア番号に応じたフィルタリング（4階・5階は4-5カテゴリのみ）
 * - alt_name が "wall" なら壁色（#A8B996）、それ以外は階段色（#FFAE00）
 * - restriction フラグで線の太さを変更（制限あり: 3, なし: 1.5）
 * @param data - 階段GeoJSONデータ
 * @param floor_num - フロア番号
 * @returns 階段LineLayer
 */
export function StairLayers({ data, floor_num }: Props) {
  return (
    <ShapeSource id={`stairLayers-source`} shape={data}>
      <LineLayer
        id={`stairs-line`}
        filter={
          floor_num === 4 || floor_num === 5
            ? ["==", ["get", "category"], "4-5"]
            : ["all"]
        }
        style={{
          lineColor: [
            "case",
            ["==", ["get", "alt_name"], "wall"],
            "#A8B996",
            "#FFAE00",
          ],
          lineWidth: ["case", ["==", ["get", "restriction"], "1"], 3, 1.5],
          visibility: "visible",
          // visibility: display ? "visible" : "none",
        }}
      />
    </ShapeSource>
  );
}
