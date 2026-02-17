import {
    Expression,
    FillLayerStyle,
    LineLayerStyle,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

export type LayerConfig = {
  filter?: Expression;
  fillStyle: FillLayerStyle;
  lineStyle: LineLayerStyle;
};

export type PolygonProps = {
  key?: string;
  prefixId: string;
  data: FeatureCollection;
} & LayerConfig;
