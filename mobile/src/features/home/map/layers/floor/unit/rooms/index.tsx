// rooms の公開エクスポートをまとめる。
// 8つの RoomCategory 別に動的に PolygonLayer を生成する。
import { PolygonLayer } from "../../../../components/mapComp/PolygonLayer";
import { GeoLayerProps } from "../../../../types";
import { CATEGORIES, buildCategoryFilter } from "./configs";
import type { ColorTheme } from "../../../../constants/colorPalette";

type Props = GeoLayerProps & {
  colorTheme: ColorTheme;
};

export function RoomView({ data, colorTheme, visible = true }: Props) {
  if (!data) return null;

  return (
    <>
      {CATEGORIES.map((category) => {
        const palette = colorTheme.rooms[category];
        const filter = buildCategoryFilter(category);
        return (
          <PolygonLayer
            key={category}
            prefixId={`room_category_${category}`}
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
