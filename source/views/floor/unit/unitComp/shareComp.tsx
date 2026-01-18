// ポリゴンレイヤー共通コンポーネント: LayerConfigをMaplibreレイヤーに変換して描画
import { FillLayer, LineLayer } from "@maplibre/maplibre-react-native";
import { LayerConfig } from "./LayerConfig";

/**
 * ポリゴンレイヤーのプロパティ定義
 * @property floor_num - 表示フロア番号
 * @property sourceId - データソースのID（GeoJSONソース）
 * @property config - レイヤー表示設定（塗りつぶし色、枠線色など）
 */
type Props = {
  floor_num: number;
  sourceId: string;
  config: LayerConfig;
};

/**
 * ポリゴンレイヤーコンポーネント
 * - LayerConfigに基づいてMaplibreのFillLayerとLineLayerを生成
 * - 部屋やセクションを塗りつぶしと枠線で描画
 * @param floor_num - フロア番号
 * @param sourceId - GeoJSONデータソースID
 * @param config - レイヤー表示設定
 * @returns FillLayerとLineLayerコンポーネント
 */
export function PolygonLayer({ floor_num, sourceId, config }: Props) {
  return (
    <>
      <FillLayer
        id={`${config.key}-fill-${floor_num}`}
        sourceID={sourceId}
        filter={config.filter}
        style={{
          fillColor: config.fillColor,
          visibility: "visible",
        }}
      />
      <LineLayer
        id={`${config.key}-line-${floor_num}`}
        sourceID={sourceId}
        filter={config.filter}
        style={{
          lineColor: config.lineColor,
          visibility: "visible",
          lineWidth: 1.5,
        }}
      />
    </>
  );
}
