// rooms の公開エクスポートをまとめる。
// 6つの機能ゾーン別に動的に PolygonLayer を生成する。
import { PolygonLayer } from "../../../../components/mapComp/PolygonLayer";
import { GeoLayerProps } from "../../../../types";
import { ROOM_ZONE_MAP, buildZoneFilter } from "./configs";
import type { ColorTheme, ZoneType } from "../../../../constants/colorPalette";

type Props = GeoLayerProps & {
  colorTheme: ColorTheme;
};

const ZONES: ZoneType[] = [
  "classroom",
  "specialized",
  "administration",
  "common",
  "sanitary",
  "other",
];

export function RoomView({ data, colorTheme, visible = true }: Props) {
  if (!data) return null;

  return (
    <>
      {ZONES.map((zone) => {
        const palette = colorTheme.zones[zone];
        const filter = buildZoneFilter(zone);
        return (
          <PolygonLayer
            key={zone}
            prefixId={`room_zone_${zone}`}
            data={data}
            visible={visible}
            filter={filter}
            fillStyle={{
              fillColor: palette.fill,
              fillOpacity: palette.opacity,
            }}
            lineStyle={{ lineColor: palette.line }}
          />
        );
      })}
    </>
  );
}
