// フロアレイヤーの描画コンポーネントを定義する。
import { SectionView } from "./section";
import { FloorProps } from "./types";
import { UnitView } from "./unit";

export function FloorView({
  floorData,
  colorTheme,
  visible = true,
}: FloorProps) {
  if (!floorData) return null;

  return (
    <>
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
