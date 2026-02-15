// 交流棟描画コンポーネント: 建物外形と建物名ラベルを表示
import {
  FillLayer,
  LineLayer,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

/**
 * 交流棟描画コンポーネントのプロパティ定義
 * @property data - 交流棟のフットプリント（外形）GeoJSONデータ
 */
type Props = {
  data: FeatureCollection | null;
};

/**
 * 交流棟を描画するコンポーネント
 * - 建物外形を薄いグレーで塗りつぶし、暗いグレーで枠線を表示
 * - 「交流棟」というテキストラベルをズームレベルに応じたサイズで表示
 * @param data - フットプリントGeoJSONデータ
 * @returns 交流棟のレイヤー（ShapeSource + FillLayer + LineLayer + SymbolLayer）
 */
export function Interact({ data }: Props) {
  if (!data) return null;

  return (
    <ShapeSource id="interact_source" shape={data}>
      <FillLayer
        id="interact-fill"
        style={{
          fillColor: "#EDEDED",
        }}
      />
      <LineLayer
        id="interact-line"
        style={{
          lineColor: "#CFCFCF",
          lineWidth: 1.5,
        }}
      />
      <SymbolLayer
        id="interact-symbol"
        style={{
          textField: "交流棟",
          textSize: ["interpolate", ["linear"], ["zoom"], 17.2, 12, 21.1, 20],
          textAllowOverlap: true, // 他のラベルやアイコンと重なっても表示
          textIgnorePlacement: true,
          textColor: "#000000",
          textFont: ["Noto Sans Regular"],
        }}
      />
    </ShapeSource>
  );
}
