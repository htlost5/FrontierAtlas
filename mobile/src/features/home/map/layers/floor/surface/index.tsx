// surface レイヤーの公開エクスポートをまとめる。
import { PolygonLayer } from "../../../components/mapComp/PolygonLayer";
import { GeoLayerProps } from "../../../types";
import type { RoomCategoryPalette } from "../../../constants/colorPalette";

type Props = GeoLayerProps & {
  palette: RoomCategoryPalette;
};

export function SurfaceLayer({ data, palette, visible = true }: Props) {
  if (!data) return null;
  return (
    <PolygonLayer
      prefixId="surface"
      data={data}
      visible={visible}
      fillStyle={{ fillColor: palette.fill, fillOpacity: palette.opacity }}
      lineStyle={{ lineColor: palette.line, lineWidth: 1.5 }}
    />
  );
}
