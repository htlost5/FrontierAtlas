// フロアレイヤーの描画コンポーネントを定義する。
import { SectionView } from "./section";
import { FloorProps } from "./types";
import { UnitView } from "./unit";
import { PolygonLayer } from "../../components/mapComp/PolygonLayer";
import {
  getBuildingsFillStyle,
  getBuildingsLineStyle,
} from "../buildings/style";

export function FloorView({
  floorData,
  colorTheme,
  visible = true,
}: FloorProps) {
  if (!floorData) return null;

  return (
    <>
      {/* Floor surface — rendered below unit/section, above venue */}
      <PolygonLayer
        prefixId="floorSurface"
        data={floorData.sections}
        visible={visible}
        fillStyle={getBuildingsFillStyle(colorTheme.buildings)}
        lineStyle={getBuildingsLineStyle(colorTheme.buildings)}
      />
      <SectionView
        data={floorData.sections}
        colorTheme={colorTheme}
        visible={visible}
      />
      <UnitView
        data={floorData.units}
        colorTheme={colorTheme}
        visible={visible}
      />
    </>
  );
}
