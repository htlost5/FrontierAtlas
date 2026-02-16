import type { FeatureCollection } from "geojson";
import { FillLayerStyle, LineLayerStyle } from "@maplibre/maplibre-react-native";

export type PolygonProps = {
    key?: string;
    prefixId: string;
    data: FeatureCollection;
    fillStyle: FillLayerStyle;
    lineStyle: LineLayerStyle;
}