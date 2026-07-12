// section の公開エクスポートをまとめる。
import { PolygonLayer } from "../../../components/mapComp/PolygonLayer";
import { GeoLayerProps } from "../../../types";
import { getSectionFillStyle, getSectionLineStyle } from "./style";
import type { ColorTheme } from "../../../constants/colorPalette";

type Props = GeoLayerProps & {
  colorTheme: ColorTheme;
};

export function SectionView({ data, colorTheme, visible = true }: Props) {
  if (!data) return null;

  return (
    <PolygonLayer
      prefixId="section"
      data={data}
      visible={visible}
      fillStyle={getSectionFillStyle(colorTheme.sections)}
      lineStyle={getSectionLineStyle(colorTheme.sections)}
    />
  );
}
