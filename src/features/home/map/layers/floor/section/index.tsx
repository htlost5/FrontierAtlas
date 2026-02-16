import { PolygonLayer } from "../../../components/mapComp/PolygonLayer";
import { sectionFillStyle, sectionLineStyle } from "./style";
import { SectionProps } from "./types";

export function SectionView({ data }: SectionProps) {
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
