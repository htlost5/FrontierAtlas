// venue の公開エクスポートをまとめる。
import React from "react";

// MapLibreのレイヤーコンポーネントとGeoJSON型をインポート
import { PolygonLayer } from "../../components/mapComp/PolygonLayer";
import { GeoLayerProps } from "../../types";
import { getVenueFillStyle, getVenueLineStyle } from "./style";
import type { ColorTheme } from "../../constants/colorPalette";

type Props = GeoLayerProps & {
  colorTheme: ColorTheme;
};

// 施設全体の外枠（敷地境界）を塗りつぶしと枠線で描画するコンポーネント
export const VenueView = React.memo(function VenueView({
  data,
  colorTheme,
}: Props) {
  if (!data) return null;

  return (
    <PolygonLayer
      prefixId="venue"
      data={data}
      fillStyle={getVenueFillStyle(colorTheme.venue)}
      lineStyle={getVenueLineStyle(colorTheme.venue)}
    />
  );
});
