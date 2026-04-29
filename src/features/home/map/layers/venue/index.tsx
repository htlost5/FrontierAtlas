// venue の公開エクスポートをまとめる。
import React from "react";

// MapLibreのレイヤーコンポーネントとGeoJSON型をインポート
import { PolygonLayer } from "../../components/mapComp/PolygonLayer";
import { GeoLayerProps } from "../../types";
import { venueFillStyle, venueLineStyle } from "./style";

// 施設全体の外枠（敷地境界）を塗りつぶしと枠線で描画するコンポーネント
export function VenueView({ data }: GeoLayerProps) {
  if (!data) return null;

  return (
    <PolygonLayer
      prefixId="venue"
      data={data}
      fillStyle={venueFillStyle}
      lineStyle={venueLineStyle}
    />
  );
}
