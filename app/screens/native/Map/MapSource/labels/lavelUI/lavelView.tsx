import LavelLayer from "@/components/MapUI/lavelComp/shareComp";
import { ShapeSource } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { ROOM_CONFIGS } from "../../Floors/floor_n/unitSource/02_room/layers/share/roomConfigs";
import { LAVEL_CONFIGS, LavelKey } from "./configs/lavelConfigs";

type Props = {
  floor_num: number;
  data: FeatureCollection;
};

export default function RoomLavel({ floor_num, data }: Props) {
  const lavelSourceId = `lavelView-${floor_num}`;

  return (
    <>
      <ShapeSource id={lavelSourceId} shape={data}>
        {(Object.keys(ROOM_CONFIGS) as LavelKey[]).map((key) => (
          <LavelLayer
            key={key}
            floor_num={floor_num}
            sourceId={lavelSourceId}
            config={LAVEL_CONFIGS[key]}
          />
        ))}
      </ShapeSource>
    </>
  );
}
