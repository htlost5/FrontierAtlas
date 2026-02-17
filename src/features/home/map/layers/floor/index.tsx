import { SectionView } from "./section";
import { FloorProps } from "./types";
import { UnitView } from "./unit";

export function FloorView({ data }: FloorProps) {
  if (!data) return null;

  return (
    <>
      <SectionView data={data.sections} />
      <UnitView data={data.units} />
    </>
  );
}
