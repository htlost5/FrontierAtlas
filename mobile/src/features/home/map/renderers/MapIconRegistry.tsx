// 部屋タイプ別アイコン画像のMapLibre Images登録コンポーネント
// source/labels/label.tsx から移植
import { Images } from "@maplibre/maplibre-react-native";

// 各部屋タイプのアイコン画像をインポート
import artRoom from "@/assets/images/icons/MapView/map/unitIcons/artRoom.png";
import audiovisualRoom from "@/assets/images/icons/MapView/map/unitIcons/audiovisualRoom.png";
import broadcastRoom from "@/assets/images/icons/MapView/map/unitIcons/broadcastRoom.png";
import calligraphyRoom from "@/assets/images/icons/MapView/map/unitIcons/calligraphyRoom.png";
import classroom from "@/assets/images/icons/MapView/map/unitIcons/classroom.png";
import conferenceRoom from "@/assets/images/icons/MapView/map/unitIcons/conferenceRoom.png";
import cookingRoom from "@/assets/images/icons/MapView/map/unitIcons/cookingRoom.png";
import craftRoom from "@/assets/images/icons/MapView/map/unitIcons/craftRoom.png";
import dressingRoom from "@/assets/images/icons/MapView/map/unitIcons/dressingRoom.png";
import itRoom from "@/assets/images/icons/MapView/map/unitIcons/itRoom.png";
import japaneseStyleRoom from "@/assets/images/icons/MapView/map/unitIcons/japaneseStyleRoom.png";
import laboratory from "@/assets/images/icons/MapView/map/unitIcons/laboratory.png";
import library from "@/assets/images/icons/MapView/map/unitIcons/library.png";
import lockerRoom from "@/assets/images/icons/MapView/map/unitIcons/lockerRoom.png";
import musicRoom from "@/assets/images/icons/MapView/map/unitIcons/musicRoom.png";
import nurseOffice from "@/assets/images/icons/MapView/map/unitIcons/nurseoffice.png";
import preparationRoom from "@/assets/images/icons/MapView/map/unitIcons/preparationRoom.png";
import printingRoom from "@/assets/images/icons/MapView/map/unitIcons/printingRoom.png";
import privateLounge from "@/assets/images/icons/MapView/map/unitIcons/privateLounge.png";
import sewingRoom from "@/assets/images/icons/MapView/map/unitIcons/sewingRoom.png";
import staffRoom from "@/assets/images/icons/MapView/map/unitIcons/staffRoom.png";
import storageRoom from "@/assets/images/icons/MapView/map/unitIcons/storageRoom.png";
import studyRoom from "@/assets/images/icons/MapView/map/unitIcons/studyRoom.png";
import wasteRoom from "@/assets/images/icons/MapView/map/unitIcons/wasteRoom.png";

/**
 * 画像マッピングオブジェクト
 * - key: MapLibreシンボル名（roomTypeと一致）
 * - value: インポートした画像アセット
 * - エイリアス（homeEconomicsRoom→classroom, studioRoom→preparationRoom, office→preparationRoom）も含む
 */
const ICON_IMAGES: Record<string, any> = {
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
};

/**
 * MapLibre Images登録コンポーネント
 * - 部屋タイプ別の全アイコン画像をMapLibreに一括登録
 * - MapIconLabel の内部で使用される
 */
export function MapIconRegistry() {
  return <Images id="map-symbols" images={ICON_IMAGES} />;
}
