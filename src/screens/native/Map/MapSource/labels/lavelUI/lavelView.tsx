// ラベルビューコンポーネント: 部屋ラベル（アイコン＋テキスト）を一括描画
import { LavelLayer } from "@/components/MapUI/lavelComp/shareComp";
import { ShapeSource } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { LAVEL_CONFIGS, LavelKey } from "./configs/lavelConfigs";

/**
 * ラベルビューコンポーネントのプロパティ定義
 * @property floor_num - フロア番号
 * @property data - 部屋のGeoJSONデータ
 */
type Props = {
  floor_num: number;
  data: FeatureCollection;
};

/**
 * 部屋ラベル描画コンポーネント
 * - LAVEL_CONFIGS のすべてのキーをループして LavelLayer を生成
 * - ロビー、教室、トイレなど様々なラベルタイプを描画
 * @param floor_num - フロア番号
 * @param data - 部屋GeoJSONデータ
 * @returns ラベルタイプ別のLavelLayerリスト
 */
export function RoomLabel({ floor_num, data }: Props) {
  // 階層ごとにユニークなデータソースIDを生成
  const labelSourceId = `lavelView-${floor_num}`;

  return (
    <>
      {/* GeoJSONデータをMapLibreのデータソースとして登録 */}
      <ShapeSource id={labelSourceId} shape={data}>
        {/* すべてのラベルタイプ（ロビー、教室、トイレなど）に対してレイヤーを生成 */}
        {(Object.keys(LAVEL_CONFIGS) as LavelKey[]).map((key) => (
          <LavelLayer
            key={key}
            floor_num={floor_num}
            sourceId={labelSourceId}
            config={LAVEL_CONFIGS[key]}
          />
        ))}
      </ShapeSource>
    </>
  );
}
