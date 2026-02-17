import { SectionView } from "./section";
import { FloorProps } from "./types";
import { BaseView } from "./unit/bases";

export function FloorView({ data }: FloorProps) {
  if (!data) return null;

  return (
    <>
      <SectionView data={data.sections} />
      <BaseView data={data.units} />
    </>
  );
}
