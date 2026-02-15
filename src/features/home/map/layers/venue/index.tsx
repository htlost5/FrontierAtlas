import React from "react";

// MapLibreのレイヤーコンポーネントとGeoJSON型をインポート
import {
  FillLayer,
  LineLayer,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import { venueFillStyle, venueLineStyle } from "./style";
import { VenueProps } from "./types";

// 施設全体の外枠（敷地境界）を塗りつぶしと枠線で描画するコンポーネント
export function Venue({ data }: VenueProps) {
  // データが存在しない場合は何も描画しない
  if (!data) return null;

  return (
    <ShapeSource id="venue_source" shape={data}>
      {/* 施設エリアの塗りつぶし（淡い青色） */}
      <FillLayer
        id="venue-fill"
        style={venueFillStyle}
      />
      {/* 施設エリアの枠線（青色） */}
      <LineLayer
        id="venue-line"
        style={venueLineStyle}
      />
    </ShapeSource>
  );
}
