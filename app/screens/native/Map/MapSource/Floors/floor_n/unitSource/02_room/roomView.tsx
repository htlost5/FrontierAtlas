import { PolygonLayer } from "@/components/MapUI/unitComp/shareComp";
import { ShapeSource } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { ROOM_FILTERS } from "./filters/filters";
import { ROOM_CONFIGS } from "./layers/share/roomConfigs";

type Props = {
  floor_num: number;
  data: FeatureCollection;
};

type RoomKey = keyof typeof ROOM_FILTERS;

export default function RoomView({ floor_num, data }: Props) {
  const roomSourceId = `roomView-${floor_num}`;

  return (
    <ShapeSource id={roomSourceId} shape={data}>
      {(Object.keys(ROOM_CONFIGS) as RoomKey[]).map((key) => (
        <PolygonLayer
          key={key}
          floor_num={floor_num}
          sourceId={roomSourceId}
          config={ROOM_CONFIGS[key]}
        />
      ))}
    </ShapeSource>
  );
}
