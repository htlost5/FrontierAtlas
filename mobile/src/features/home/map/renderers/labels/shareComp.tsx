// ラベルレイヤー共通コンポーネント: ラベル設定をMaplibreシンボルレイヤーに変換して描画
import { SymbolLayer } from "@maplibre/maplibre-react-native";
import { LavelConfig } from "./LavelConfig";

/**
 * ラベルレイヤーのプロパティ定義
 * @property floor_num - 表示フロア番号
 * @property sourceId - データソースのID
 * @property config - ラベル表示設定（アイコン、テキストなど）
 */
type Props = {
  floor_num: number;
  sourceId: string;
  config: LavelConfig;
};

/**
 * ラベルレイヤーコンポーネント
 * - LavelConfigに基づいてMaplibreのシンボルレイヤーを生成
 * - アイコンとテキスト（部屋名）の表示/非表示を制御
 * - ズームレベルに応じたアイコンとテキストサイズの自動調整
 * @param floor_num - フロア番号
 * @param sourceId - GeoJSONデータソースID
 * @param config - ラベル表示設定
 * @returns SymbolLayerコンポーネント
 */
export function LavelLayer({ floor_num, sourceId, config }: Props) {
  return (
    <>
      <SymbolLayer
        id={`${config.key}-symbol`}
        sourceID={sourceId}
        filter={config.filter}
        style={{
          symbolPlacement: "point",
          iconImage: config.iconVisible ? config.key : "",
          iconSize: [
            "interpolate",
            ["linear"],
            ["zoom"],
            17,
            0.35,
            19,
            0.45,
            21,
            0.55,
          ],
          iconRotationAlignment: "viewport",
          iconAllowOverlap: false,

          textField: config.textVisible ? ["get", "ja", ["get", "name"]] : "",
          textSize: [
            "interpolate",
            ["linear"],
            ["zoom"],
            17,
            10,
            19,
            12,
            21,
            14,
          ],
          textFont: ["Noto Sans Regular"],
          textColor: config.textColor,
          textAnchor: config.iconVisible ? "left" : "center",
          textOffset: config.iconVisible ? [1.4, 0] : [0, 0],
          textAllowOverlap: false,
          textIgnorePlacement: false,
        }}
      />
    </>
  );
}
