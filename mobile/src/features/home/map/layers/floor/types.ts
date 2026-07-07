// フロアレイヤーの型定義をまとめる。
import { GeoLayerProps } from "../../types";

export type FloorProps = {
  floorData: {
    units: GeoLayerProps["data"];
    sections: GeoLayerProps["data"];
  };
  stairsData: GeoLayerProps["data"];
};
