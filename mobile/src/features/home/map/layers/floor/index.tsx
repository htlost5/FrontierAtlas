// フロアレイヤーの描画コンポーネントを定義する。
import { SectionView } from "./section";
import { FloorProps } from "./types";
import { UnitView } from "./unit";

export function FloorView({ floorData, stairsData, colorTheme }: FloorProps) {
  if (!(floorData && stairsData)) return null;

  return (
    <>
      <SectionView data={floorData.sections} colorTheme={colorTheme} />
      <UnitView data={floorData.units} colorTheme={colorTheme} />
    </>
  );
}
