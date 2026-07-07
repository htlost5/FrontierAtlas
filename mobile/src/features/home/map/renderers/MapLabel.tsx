// マップラベル描画のレンダリング補助を提供する。
import { Expression, SymbolLayer } from "@maplibre/maplibre-react-native";
import React from "react";

type Props = {
  id: string;
  sourceID?: string;
  textField: string;
  textSize?: number;
  filter?: Expression;
};

export function MapLabel({
  id,
  sourceID,
  textField,
  textSize = 12,
  filter,
}: Props) {
  return (
    <SymbolLayer
      id={id}
      sourceID={sourceID}
      filter={filter}
      style={{
        textField: ["get", textField],
        textSize,
        textAllowOverlap: false,
        textOptional: true,
      }}
    />
  );
}
