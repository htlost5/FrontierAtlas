import { Images } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import UnitSymbol from "./iconSources/unit/unit-label";
import RoomLavel from "./lavelUI/lavelView";

import classroom from "@/assets/images/icons/MapView/map/unitIcons/classroom.png";
import studyRoom from "@/assets/images/icons/MapView/map/unitIcons/studyRoom.png";
import library from "@/assets/images/icons/MapView/map/unitIcons/library.png";
import laboratory from "@/assets/images/icons/MapView/map/unitIcons/laboratory.png";
import preparationRoom from "@/assets/images/icons/MapView/map/unitIcons/preparationRoom.png";
import itRoom from "@/assets/images/icons/MapView/map/unitIcons/itRoom.png";
import artRoom from "@/assets/images/icons/MapView/map/unitIcons/artRoom.png";
import calligraphyRoom from "@/assets/images/icons/MapView/map/unitIcons/calligraphyRoom.png";
import craftRoom from "@/assets/images/icons/MapView/map/unitIcons/craftRoom.png";
import sewingRoom from "@/assets/images/icons/MapView/map/unitIcons/sewingRoom.png";
import cookingRoom from "@/assets/images/icons/MapView/map/unitIcons/cookingRoom.png";
import audiovisualRoom from "@/assets/images/icons/MapView/map/unitIcons/audiovisualRoom.png";
import musicRoom from "@/assets/images/icons/MapView/map/unitIcons/musicRoom.png";
import japaneseStyleRoom from "@/assets/images/icons/MapView/map/unitIcons/japaneseStyleRoom.png";
import conferenceRoom from "@/assets/images/icons/MapView/map/unitIcons/conferenceRoom.png";
import broadcastRoom from "@/assets/images/icons/MapView/map/unitIcons/broadcastRoom.png";
import staffRoom from "@/assets/images/icons/MapView/map/unitIcons/staffRoom.png";
import nurseOffice from "@/assets/images/icons/MapView/map/unitIcons/nurseoffice.png";
import printingRoom from "@/assets/images/icons/MapView/map/unitIcons/printingRoom.png";
import lockerRoom from "@/assets/images/icons/MapView/map/unitIcons/lockerRoom.png";
import dressingRoom from "@/assets/images/icons/MapView/map/unitIcons/dressingRoom.png";
import storageRoom from "@/assets/images/icons/MapView/map/unitIcons/storageRoom.png";
import wasteRoom from "@/assets/images/icons/MapView/map/unitIcons/wasteRoom.png";
import privateLounge from "@/assets/images/icons/MapView/map/unitIcons/privateLounge.png";

type Props = {
  floor_num: number;
  data: FeatureCollection | null;
  display: number;
};

export default function LabelView({ floor_num, data, display }: Props) {
  if (!data) return null;

  //   display_point→geometryへ設定
  const processedFeatures = data.features.map((f) => ({
    ...f,
    geometry: f.properties?.display_point,
  }));

  const processedGeoJson = {
    ...data,
    features: processedFeatures,
  };

  const isVisible = display;

  return (
    <>
      <Images
        id="map-symbols"
        images={{
          classroom: classroom,
          studyRoom: studyRoom,
          library: library,
          laboratory: laboratory,
          preparationRoom: preparationRoom,
          itRoom: itRoom,
          artRoom: artRoom,
          calligraphyRoom: calligraphyRoom,
          craftRoom: craftRoom,
          sewingRoom: sewingRoom,
          homeEconomicsRoom: classroom,
          cookingRoom: cookingRoom,
          audiovisualRoom: audiovisualRoom,
          musicRoom: musicRoom,
          japaneseStyleRoom: japaneseStyleRoom,
          conferenceRoom: conferenceRoom,
          broadcastRoom: broadcastRoom,
          studioRoom: preparationRoom,
          staffRoom: staffRoom,
          office: preparationRoom,
          nurseOffice: nurseOffice,
          printingRoom: printingRoom,
          lockerRoom: lockerRoom,
          dressingRoom: dressingRoom,
          storageRoom: storageRoom,
          wasteRoom: wasteRoom,
          privateLounge: privateLounge,
        }}
      />
      <RoomLavel floor_num={floor_num} data={data} />
      <UnitSymbol
        pointData={processedGeoJson}
        isVisible={isVisible}
        floor_num={floor_num}
      />
    </>
  );
}
