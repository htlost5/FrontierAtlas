// セクション描画コンポーネント: 廊下や共有エリアを塗りつぶしと枠線で表示
import React from "react";

import {
  FillLayer,
  LineLayer,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

/**
 * セクション描画コンポーネントのプロパティ定義
 * @property data - セクションのGeoJSONデータ
 * @property floor_num - フロア番号
 */
type Props = {
  data: FeatureCollection | null;
  floor_num: number;
};

/**
 * フロア内のセクションを描画するコンポーネント
 * - セクション（廊下や共有スペース）を淡いベージュ色で塗りつぶし
 * - 枠線で境界を表示
 * @param data - セクションGeoJSONデータ
 * @param floor_num - フロア番号
 * @returns セクションレイヤー（ShapeSource + FillLayer + LineLayer）
 */
export default function FloorN_section({ data, floor_num }: Props) {
  if (!data) return null;

  return (
    <ShapeSource id={`section-source-${floor_num}`} shape={data}>
      <FillLayer
        id="section-fill"
        style={{
          fillColor: "#FFF5D9",
          visibility: "visible",
          // visibility: display ? "visible" : "none",
        }}
      />
      <LineLayer
        id="section-line"
        style={{
          lineColor: "#F0DFAF",
          lineWidth: 1.5,
          visibility: "visible",
          // visibility: display ? "visible" : "none",
        }}
      />
    </ShapeSource>
  );
}
