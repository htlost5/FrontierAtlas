// section の公開エクスポートをまとめる。
import { PolygonLayer } from "../../../components/mapComp/PolygonLayer";
import { GeoLayerProps } from "../../../types";
import { sectionFillStyle, sectionLineStyle } from "./style";

export function SectionView({ data }: GeoLayerProps) {
  if (!data) return null;

  return (
    <PolygonLayer
      prefixId="section"
      data={data}
      fillStyle={sectionFillStyle}
      lineStyle={sectionLineStyle}
    />
  );
}
