import { FillLayer, LineLayer } from "@maplibre/maplibre-react-native";
import { FILTERS } from "../filters/filters";

type Props = {
    floor_num: number;
    sourceId: string;
}

export default function WallLayers({ floor_num, sourceId }: Props) {
  return (
    <>
      <FillLayer
        id={`wall-fill-${floor_num}`}
        sourceID={sourceId}
        filter={FILTERS.wall}
        style={{
          fillColor: "#B0B0B0",
          visibility: "visible",
          // visibility: display ? "visible" : "none",
        }}
      />
      <LineLayer
        id={`wall-line-${floor_num}`}
        sourceID={sourceId}
        filter={FILTERS.wall}
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
