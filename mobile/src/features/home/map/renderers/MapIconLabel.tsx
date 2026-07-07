// マップアイコンラベル統合コンポーネント
// source/labels/label.tsx + source/labels/lavelUI/lavelView.tsx から移植
// display_point変換、RoomLabel、UnitSymbolを統合
import { ShapeSource } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { MapIconRegistry } from "./MapIconRegistry";
import { LavelLayer } from "./labels/shareComp";
import { LAVEL_CONFIGS, LavelKey } from "./labels/LavelConfigs";
import { UnitSymbol } from "./UnitSymbol";

type Props = {
  floor_num: number;
  data: FeatureCollection | null;
  isVisible: boolean;
};

/**
 * マップアイコンラベル統合レンダリングコンポーネント
 * - 部屋タイプ別アイコン画像をMapLibreに登録（MapIconRegistry）
 * - display_point（部屋の中心座標）にジオメトリ変換
 * - 部屋ラベル（テキスト+アイコン）をLavelLayerで描画
 * - 特殊シンボル（トイレ、エレベーターなど）をUnitSymbolで描画
 */
export function MapIconLabel({ floor_num, data, isVisible }: Props) {
  if (!data) return null;

  // display_point（部屋の中心座標）をgeometryに設定してアイコン表示位置を決定
  const processedFeatures = data.features.map((f) => ({
    ...f,
    geometry: f.properties?.display_point,
  }));

  // 処理済みデータでGeoJSONオブジェクトを再構成
  const processedGeoJson: FeatureCollection = {
    ...data,
    features: processedFeatures,
  };

  const labelSourceId = "lavelView";

  return (
    <>
      {/* MapLibreで使用する部屋タイプアイコンを一括登録 */}
      <MapIconRegistry />

      {/* GeoJSONデータをMapLibreのデータソースとして登録 */}
      <ShapeSource id={labelSourceId} shape={processedGeoJson}>
        {/* すべてのラベルタイプに対してレイヤーを生成 */}
        {(Object.keys(LAVEL_CONFIGS) as LavelKey[]).map((key) => (
          <LavelLayer
            key={key}
            floor_num={floor_num}
            sourceId={labelSourceId}
            config={LAVEL_CONFIGS[key]}
          />
        ))}
      </ShapeSource>

      {/* トイレ・エレベータ・自販機などの特殊シンボルを描画 */}
      <UnitSymbol
        pointData={processedGeoJson}
        isVisible={isVisible ? 1 : 0}
      />
    </>
  );
}
