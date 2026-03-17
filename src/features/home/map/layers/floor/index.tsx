import { SectionView } from "./section";
import { FloorProps } from "./types";
import { UnitView } from "./unit";

export function FloorView({ floorData, stairsData }: FloorProps) {
  if (!(floorData && stairsData)) return null;

  return (
    <>
      <SectionView data={floorData.sections} />
      <UnitView data={floorData.units} />
    </>
  );
}
