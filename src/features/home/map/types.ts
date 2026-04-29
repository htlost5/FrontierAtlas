// マップレイヤーで利用する型定義をまとめる。
import type { FeatureCollection } from "geojson";

export type GeoLayerProps = {
  data: FeatureCollection | null;
  visible?: boolean;
};
