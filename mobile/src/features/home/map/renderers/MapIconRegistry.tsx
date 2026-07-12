// カテゴリ別アイコン画像のMapLibre Images登録コンポーネント
import { Images } from "@maplibre/maplibre-react-native";

// Tabler Icons から変換されたカテゴリアイコン（8種）
import iconLearning from "@/assets/images/icons/MapView/map/categoryIcons/learning.png";
import iconLaboratory from "@/assets/images/icons/MapView/map/categoryIcons/laboratory.png";
import iconCreative from "@/assets/images/icons/MapView/map/categoryIcons/creative.png";
import iconMeeting from "@/assets/images/icons/MapView/map/categoryIcons/meeting.png";
import iconStaff from "@/assets/images/icons/MapView/map/categoryIcons/staff.png";
import iconSocial from "@/assets/images/icons/MapView/map/categoryIcons/social.png";
import iconSanitary from "@/assets/images/icons/MapView/map/categoryIcons/sanitary.png";
import iconCirculation from "@/assets/images/icons/MapView/map/categoryIcons/circulation.png";

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
 * - 8カテゴリの Tabler Icons 変換アイコンを一括登録
 * - sanitary の toilet サブグループは別途 Toilet コンポーネントで描画
 */
export function MapIconRegistry() {
  return <Images id="map-category-icons" images={ICON_IMAGES} />;
}
