// カテゴリ別アイコン画像のMapLibre Images登録コンポーネント
import { Images } from "@maplibre/maplibre-react-native";

// Tabler Icons から変換されたカテゴリアイコン（8種）
// NOTE: 初回はPNGが存在しないため、既存のアイコンから代表的なものを一時的に流用する
//        本番では tools/map-assets/scripts/convert-tabler-icons.ts で生成したPNGを使用
import iconLearning from "@/assets/images/icons/MapView/map/unitIcons/classroom.png";
import iconLaboratory from "@/assets/images/icons/MapView/map/unitIcons/laboratory.png";
import iconCreative from "@/assets/images/icons/MapView/map/unitIcons/artRoom.png";
import iconMeeting from "@/assets/images/icons/MapView/map/unitIcons/conferenceRoom.png";
import iconStaff from "@/assets/images/icons/MapView/map/unitIcons/staffRoom.png";
import iconSocial from "@/assets/images/icons/MapView/map/unitIcons/privateLounge.png";
import iconSanitary from "@/assets/images/icons/MapView/map/unitIcons/lockerRoom.png";
import iconCirculation from "@/assets/images/icons/MapView/map/unitIcons/storageRoom.png";

/** 8カテゴリのアイコン画像マッピング */
const ICON_IMAGES: Record<string, number> = {
  learning: iconLearning,
  laboratory: iconLaboratory,
  creative: iconCreative,
  meeting: iconMeeting,
  staff: iconStaff,
  social: iconSocial,
  sanitary: iconSanitary,
  circulation: iconCirculation,
};

/**
 * MapLibre Images登録コンポーネント
 * - 8カテゴリのアイコンを一括登録
 * - sanitary の toilet サブグループは別途 Toilet コンポーネントで描画
 */
export function MapIconRegistry() {
  return <Images id="map-category-icons" images={ICON_IMAGES} />;
}
