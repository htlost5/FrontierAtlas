// types の型定義をまとめる。
import {
  Expression,
  FillLayerStyle,
  LineLayerStyle,
} from "@maplibre/maplibre-react-native";
import { GeoLayerProps } from "../../../types";

export type LayerConfig = {
  filter?: Expression;
  fillStyle: FillLayerStyle;
  lineStyle: LineLayerStyle;
};

export type PolygonProps = {
  key?: string;
  prefixId: string;
} & GeoLayerProps &
  LayerConfig;
