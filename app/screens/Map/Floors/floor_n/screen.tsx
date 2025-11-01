import React from "react";

import FloorN_section from "./section";
import FloorN_unit from "./unit";

type Props = {
  floor_num: number;
};

export default function FloorN({ floor_num }: Props) {
  const num = floor_num;

  return (
    <>
      <FloorN_section floor_num={num} />
      <FloorN_unit floor_num={num} />
    </>
  );
}
