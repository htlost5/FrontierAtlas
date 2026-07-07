// rooms の公開エクスポートをまとめる。
import { PolygonLayer } from "../../../../components/mapComp/PolygonLayer";
import { GeoLayerProps } from "../../../../types";
import { ROOM_CONFIGS } from "./configs";

export function RoomView({ data }: GeoLayerProps) {
  if (!data) return null;

  return (
    <>
      {Object.entries(ROOM_CONFIGS).map(([key, config]) => {
        return (
          <PolygonLayer
            key={key}
            prefixId={`units_room_${key}`}
            data={data}
            filter={config.filter}
            fillStyle={config.fillStyle}
            lineStyle={config.lineStyle}
          />
        );
      })}
    </>
  );
}
