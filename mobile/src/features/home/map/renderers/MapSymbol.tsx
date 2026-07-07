// マップシンボル描画のレンダリング補助を提供する。
import { Expression, SymbolLayer } from "@maplibre/maplibre-react-native";
import React from "react";

type Props = {
  id: string;
  sourceID?: string;
  iconImage: string;
  iconSize?: number | Expression;
  filter?: Expression;
};

export function MapSymbol({
  id,
  sourceID,
  iconImage,
  iconSize = 1,
  filter,
}: Props) {
  return (
    <SymbolLayer
      id={id}
      sourceID={sourceID}
      filter={filter}
      style={{
        iconImage,
        iconSize,
        iconAllowOverlap: false,
      }}
    />
  );
}
