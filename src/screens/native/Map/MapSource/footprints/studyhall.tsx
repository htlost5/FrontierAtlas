// 学習棟描画コンポーネント: 建物外形と建物名ラベルを表示（現在は不可視）
import {
  FillLayer,
  LineLayer,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

/**
 * 学習棟描画コンポーネントのプロパティ定義
 * @property data - 学習棟のフットプリント（外形）GeoJSONデータ
 */
type Props = {
  data: FeatureCollection | null;
};

/**
 * 学習棟を描画するコンポーネント
 * - 建物外形のレイヤー（現在は不可視に設定）
 * - 「学習棟」というテキストラベルのレイヤー（表示/非表示の切り替え機能付き）
 * @param data - フットプリントGeoJSONデータ
 * @returns 学習棟のレイヤー（ShapeSource + FillLayer + LineLayer + SymbolLayer）
 */
export function Studyhall({ data }: Props) {
  if (!data) return null;

  return (
    <ShapeSource id="studyhall_source" shape={data}>
      <FillLayer
        id="studyhall-fill"
        style={{
          fillColor: "#EDEDED",
          fillOpacity: 0,
        }}
      />
      <LineLayer
        id="studyhall-line"
        style={{
          lineColor: "#CFCFCF",
          lineWidth: 1.5,
          lineOpacity: 0,
        }}
      />
      <SymbolLayer
        id="studyhall-symbol"
        style={{
          textField: "学習棟",
          textSize: ["interpolate", ["linear"], ["zoom"], 17.2, 12, 21.1, 20],
          textAllowOverlap: true, // 他のラベルやアイコンと重なっても表示
          textIgnorePlacement: true,
          textColor: "#000000",
          textFont: ["Noto Sans Regular"],
          visibility: "none",
        }}
      />
    </ShapeSource>
  );
}
