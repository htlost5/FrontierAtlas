// 建物レイヤーのスタイル定義をまとめる。
import type { FillLayerStyle, LineLayerStyle } from "@maplibre/maplibre-react-native";

export const buildingsFillStyle: FillLayerStyle = {
    fillColor: "#EDEDED",
    fillOpacity: 0.8,
}

export const buildingsLineStyle: LineLayerStyle = {
    lineColor: "#CFCFCF",
    lineWidth: 1.5,
    lineOpacity: 1,
}