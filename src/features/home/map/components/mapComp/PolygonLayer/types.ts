import type { FeatureCollection } from "geojson";
import { FillLayerStyle, LineLayerStyle } from "@maplibre/maplibre-react-native";

export type PolygonProps = {
    prefixId: string;
    data: FeatureCollection;
    fillStyle: FillLayerStyle;
    lineStyle: LineLayerStyle;
}