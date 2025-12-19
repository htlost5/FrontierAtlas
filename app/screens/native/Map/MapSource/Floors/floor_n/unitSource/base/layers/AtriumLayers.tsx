import { FillLayer, LineLayer } from "@maplibre/maplibre-react-native";
import { FILTERS } from "../filters/filters";

type Props = {
  floor_num: number;
  sourceId: string;
};

export default function AtliumLayers({ floor_num, sourceId }: Props) {
  return (
    <>
      <FillLayer
        id={`atrium-fill-${floor_num}`}
        sourceID={sourceId}
        filter={FILTERS.atrium}
        style={{
          fillColor: "#C9D2B0",
          visibility: "visible",
          // visibility: display ? "visible" : "none",
        }}
      />
      <LineLayer
        id={`atrium-line-${floor_num}`}
        sourceID={sourceId}
        filter={FILTERS.atrium}
        style={{
          lineColor: "rgba(0,0,0,0.2)",
          lineOpacity: 1.5,
          visibility: "visible",
          // visibility: display ? "visible" : "none",
        }}
      />
    </>
  );
}
