// カテゴリ別アイコン画像 + 特殊シンボル画像のMapLibre Images登録コンポーネント
import { Images } from "@maplibre/maplibre-react-native";

// 複合アイコン（円形背景 + 白アイコン）— 7カテゴリ × 2テーマ
import iconLearningLight from "@/assets/images/icons/MapView/map/categoryIcons/learning-light.png";
import iconLearningDark from "@/assets/images/icons/MapView/map/categoryIcons/learning-dark.png";
import iconLaboratoryLight from "@/assets/images/icons/MapView/map/categoryIcons/laboratory-light.png";
import iconLaboratoryDark from "@/assets/images/icons/MapView/map/categoryIcons/laboratory-dark.png";
import iconCreativeLight from "@/assets/images/icons/MapView/map/categoryIcons/creative-light.png";
import iconCreativeDark from "@/assets/images/icons/MapView/map/categoryIcons/creative-dark.png";
import iconMeetingLight from "@/assets/images/icons/MapView/map/categoryIcons/meeting-light.png";
import iconMeetingDark from "@/assets/images/icons/MapView/map/categoryIcons/meeting-dark.png";
import iconStaffLight from "@/assets/images/icons/MapView/map/categoryIcons/staff-light.png";
import iconStaffDark from "@/assets/images/icons/MapView/map/categoryIcons/staff-dark.png";
import iconSocialLight from "@/assets/images/icons/MapView/map/categoryIcons/social-light.png";
import iconSocialDark from "@/assets/images/icons/MapView/map/categoryIcons/social-dark.png";
import iconSanitaryLight from "@/assets/images/icons/MapView/map/categoryIcons/sanitary-light.png";
import iconSanitaryDark from "@/assets/images/icons/MapView/map/categoryIcons/sanitary-dark.png";

// 特殊シンボル（角丸四角#444444背景 + 白アイコン）— 7種
import iconSpecialToiletMale from "@/assets/images/icons/MapView/MapLogo/special/special-toilet-male.png";
import iconSpecialToiletFemale from "@/assets/images/icons/MapView/MapLogo/special/special-toilet-female.png";
import iconSpecialToiletAccessible from "@/assets/images/icons/MapView/MapLogo/special/special-toilet-accessible.png";
import iconSpecialElevator from "@/assets/images/icons/MapView/MapLogo/special/special-elevator.png";
import iconSpecialVending from "@/assets/images/icons/MapView/MapLogo/special/special-vending.png";
import iconSpecialLocker from "@/assets/images/icons/MapView/MapLogo/special/special-locker.png";
import iconSpecialEmergencyExit from "@/assets/images/icons/MapView/MapLogo/special/special-emergency-exit.png";

/** 14個のテーマ別アイコン + 7個の特殊シンボル画像マッピング（circulation は非表示のため登録不要） */
const ICON_IMAGES: Record<string, number> = {
  "learning-light": iconLearningLight,
  "learning-dark": iconLearningDark,
  "laboratory-light": iconLaboratoryLight,
  "laboratory-dark": iconLaboratoryDark,
  "creative-light": iconCreativeLight,
  "creative-dark": iconCreativeDark,
  "meeting-light": iconMeetingLight,
  "meeting-dark": iconMeetingDark,
  "staff-light": iconStaffLight,
  "staff-dark": iconStaffDark,
  "social-light": iconSocialLight,
  "social-dark": iconSocialDark,
  "sanitary-light": iconSanitaryLight,
  "sanitary-dark": iconSanitaryDark,
  // 特殊シンボル
  "special-toilet-male": iconSpecialToiletMale,
  "special-toilet-female": iconSpecialToiletFemale,
  "special-toilet-accessible": iconSpecialToiletAccessible,
  "special-elevator": iconSpecialElevator,
  "special-vending": iconSpecialVending,
  "special-locker": iconSpecialLocker,
  "special-emergency-exit": iconSpecialEmergencyExit,
};

/**
 * MapLibre Images登録コンポーネント
 * - 7カテゴリのテーマ別円形アイコン + 7個の特殊シンボルを一括登録
 * - circulation は iconVisible: false のため円形アイコンは登録不要
 */
export function MapIconRegistry() {
  return <Images id="map-category-icons" images={ICON_IMAGES} />;
}
