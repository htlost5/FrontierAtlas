// rooms の公開エクスポートをまとめる。
import { PolygonLayer } from "../../../../components/mapComp/PolygonLayer";
import { GeoLayerProps } from "../../../../types";
import { GROUP_STYLE_CONFIGS } from "./configs";

/** 描画対象グループ（transparent はスキップ） */
const VISIBLE_GROUPS = Object.keys(
  GROUP_STYLE_CONFIGS,
) as (keyof typeof GROUP_STYLE_CONFIGS)[];

export function RoomView({ data }: GeoLayerProps) {
  if (!data) return null;

  return (
    <>
      {VISIBLE_GROUPS.map((group) => {
        const config = GROUP_STYLE_CONFIGS[group];
        return (
          <PolygonLayer
            key={group}
            prefixId={`units_room_group_${group}`}
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
