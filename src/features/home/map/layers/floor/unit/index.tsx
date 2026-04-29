// unit の公開エクスポートをまとめる。
import { GeoLayerProps } from "../../../types";
import { BaseView } from "./bases";
import { RoomView } from "./rooms";

export function UnitView({ data }: GeoLayerProps) {
  return (
    <>
      <BaseView data={data} />
      <RoomView data={data} />
    </>
  );
}
