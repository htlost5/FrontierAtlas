import React from "react";

// MapLibreのレイヤーコンポーネントとGeoJSON型をインポート
import {
  FillLayer,
  LineLayer,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

// 施設全体の外枠形状データ（GeoJSON）を受け取る
type Props = {
  data: FeatureCollection | null;
};

// 施設全体の外枠（敷地境界）を塗りつぶしと枠線で描画するコンポーネント
export function Venue({ data }: Props) {
  // データが存在しない場合は何も描画しない
  if (!data) return null;

  return (
    <ShapeSource id="venue_source" shape={data}>
      {/* 施設エリアの塗りつぶし（淡い青色） */}
      <FillLayer
        id="venue-fill"
        style={{
          fillColor: "#E8F0FF",
        }}
      />
      {/* 施設エリアの枠線（青色） */}
      <LineLayer
        id="venue-line"
        style={{
          lineColor: "#B8D1FF",
          lineWidth: 1,
        }}
      />
    </ShapeSource>
  );
}
